#!/usr/bin/env node
// Exact visual diff of a candidate capture against the baseline (DoD §4.5).
//
//   node scripts/diff.mjs --baseline <dir> --candidate <dir> --out <report-dir> [--strict]
//        [--only <regex>] [--max-diff-ratio 0.001] [--repo /workspace]
//
// Default (migration) rule: pixelmatch threshold 0.1, includeAA false; an entry passes
// with identical dimensions and <= 0.1% of its pixels differing (--max-diff-ratio).
// --strict: pixelmatch threshold 0, includeAA true (anti-aliased pixels count); an entry
// passes only with identical dimensions and 0 differing pixels. Use --strict for the
// run-vs-run determinism self-diff.
// Both modes: the mask list must be unchanged, missing/errored entries fail, and the
// environment (Playwright, Chromium, OS, fonts, viewport, DPR) must match.
//
// Writes <out>/summary.json, <out>/summary.md and <out>/<suite>/<theme>/<name>.diff.png
// for every entry with a non-zero differing-pixel count (passing or not).
// Exit code 0 = pass, 1 = any failure, 2 = usage error.
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

const args = {};
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (a.startsWith('--')) {
    const [k, v] = a.slice(2).split('=');
    if (v !== undefined) {
      args[k] = v;
    } else if (process.argv[i + 1] && !process.argv[i + 1].startsWith('--')) {
      args[k] = process.argv[++i];
    } else {
      args[k] = true;
    }
  }
}
if (!args.baseline || !args.candidate || !args.out) {
  console.error('usage: diff.mjs --baseline <dir> --candidate <dir> --out <dir>');
  process.exit(2);
}
const REPO = path.resolve(args.repo || process.env.REPO || '/workspace');
const requireFromRepo = createRequire(path.join(REPO, 'package.json'));
const pixelmatch = requireFromRepo('pixelmatch');
const { PNG } = requireFromRepo('pngjs');

const BASE = path.resolve(args.baseline);
const CAND = path.resolve(args.candidate);
const OUT = path.resolve(args.out);
const ONLY = args.only ? new RegExp(args.only) : null;
const STRICT = Boolean(args.strict);
const MAX_DIFF_RATIO = STRICT ? 0 : Number(args['max-diff-ratio'] ?? 0.001);
const PIXELMATCH_OPTIONS = {
  threshold: STRICT ? 0 : 0.1,
  includeAA: STRICT,
  alpha: 0.2,
  diffColor: [255, 0, 0],
  aaColor: [255, 255, 0],
};
const RULE = {
  mode: STRICT ? 'strict' : 'default',
  pixelmatch: { threshold: PIXELMATCH_OPTIONS.threshold, includeAA: PIXELMATCH_OPTIONS.includeAA },
  maxDiffRatioPerImage: MAX_DIFF_RATIO,
  requireIdenticalDimensions: true,
  requireIdenticalMasks: true,
};

const readManifest = (dir) => JSON.parse(fs.readFileSync(path.join(dir, 'manifest.json'), 'utf8'));
const bm = readManifest(BASE);
const cm = readManifest(CAND);

const ENV_KEYS = ['playwright', 'chromium', 'os', 'fontsSha256'];
const envMismatch = [];
for (const k of ENV_KEYS) {
  if (bm.environment?.[k] !== cm.environment?.[k]) {
    envMismatch.push({ key: k, baseline: bm.environment?.[k], candidate: cm.environment?.[k] });
  }
}
for (const k of ['viewport', 'dpr']) {
  if (JSON.stringify(bm[k]) !== JSON.stringify(cm[k])) {
    envMismatch.push({ key: k, baseline: bm[k], candidate: cm[k] });
  }
}
const warnings = [];
if (bm.environment?.harnessSha256 !== cm.environment?.harnessSha256) {
  warnings.push('harness files (targets/states/provisioning/config) differ from the baseline run');
}

const candById = new Map(cm.images.map((e) => [e.id, e]));
const baseIds = new Set(bm.images.map((e) => e.id));
const results = [];

for (const b of bm.images) {
  if (ONLY && !ONLY.test(b.id)) {
    continue;
  }
  const r = { id: b.id, suite: b.suite, theme: b.theme, name: b.name, file: b.file };
  const c = candById.get(b.id);
  if (b.error) {
    r.status = 'baseline-error';
    r.detail = b.error;
  } else if (!c) {
    r.status = 'missing';
  } else if (c.error) {
    r.status = 'candidate-error';
    r.detail = c.error;
  } else if (JSON.stringify(b.masks || []) !== JSON.stringify(c.masks || [])) {
    r.status = 'mask-changed';
    r.detail = { baseline: b.masks, candidate: c.masks };
  } else {
    const bufA = fs.readFileSync(path.join(BASE, b.file));
    const bufB = fs.readFileSync(path.join(CAND, c.file));
    const a = PNG.sync.read(bufA);
    const bb = PNG.sync.read(bufB);
    r.baselineSize = [a.width, a.height];
    r.candidateSize = [bb.width, bb.height];
    if (a.width !== bb.width || a.height !== bb.height) {
      r.status = 'size-mismatch';
    } else if (bufA.equals(bufB)) {
      r.status = 'pass';
      r.diffPixels = 0;
    } else {
      const diff = new PNG({ width: a.width, height: a.height });
      r.diffPixels = pixelmatch(a.data, bb.data, diff.data, a.width, a.height, PIXELMATCH_OPTIONS);
      r.diffRatio = r.diffPixels / (a.width * a.height);
      if (r.diffPixels === 0) {
        r.status = 'pass';
      } else {
        r.status = r.diffRatio <= MAX_DIFF_RATIO ? 'pass-within-tolerance' : 'diff';
      }
      if (r.diffPixels > 0) {
        const out = path.join(OUT, b.suite, b.theme, `${b.name}.diff.png`);
        fs.mkdirSync(path.dirname(out), { recursive: true });
        fs.writeFileSync(out, PNG.sync.write(diff));
        r.diffImage = path.relative(OUT, out);
      }
    }
  }
  results.push(r);
}
for (const c of cm.images) {
  if (!baseIds.has(c.id) && (!ONLY || ONLY.test(c.id))) {
    results.push({ id: c.id, suite: c.suite, theme: c.theme, name: c.name, status: 'not-in-baseline' });
  }
}

const counts = {};
for (const r of results) {
  counts[r.status] = (counts[r.status] || 0) + 1;
}
const PASSING = new Set(['pass', 'pass-within-tolerance']);
const failing = results.filter((r) => !PASSING.has(r.status) && r.status !== 'not-in-baseline');
const bySuite = {};
for (const r of results) {
  const k = `${r.suite}/${r.theme}`;
  bySuite[k] = bySuite[k] || { total: 0, pass: 0, fail: 0, diffPixels: 0 };
  bySuite[k].total++;
  if (PASSING.has(r.status)) {
    bySuite[k].pass++;
  } else if (r.status !== 'not-in-baseline') {
    bySuite[k].fail++;
  }
  bySuite[k].diffPixels += r.diffPixels || 0;
}
const summary = {
  baseline: { dir: BASE, commit: bm.commit, capturedAt: bm.capturedAt },
  candidate: { dir: CAND, commit: cm.commit, capturedAt: cm.capturedAt },
  rule: RULE,
  environmentMismatch: envMismatch,
  warnings,
  pass: failing.length === 0 && envMismatch.length === 0,
  counts,
  bySuite,
  totalDiffPixels: results.reduce((s, r) => s + (r.diffPixels || 0), 0),
  results: results.sort((x, y) => (y.diffPixels || 0) - (x.diffPixels || 0) || x.id.localeCompare(y.id)),
};
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'summary.json'), JSON.stringify(summary, null, 2) + '\n');

const withinTolerance = results.filter((r) => r.status === 'pass-within-tolerance');
function row(r) {
  const ratio = r.diffRatio === undefined ? '' : `${(r.diffRatio * 100).toFixed(4)}%`;
  const sizes = r.baselineSize ? `${r.baselineSize.join('x')} vs ${r.candidateSize.join('x')}` : '';
  return `| ${r.id} | ${r.status} | ${r.diffPixels ?? ''} | ${ratio} | ${sizes} | ${r.diffImage || ''} |`;
}
const md = [
  `# Visual diff: ${summary.pass ? 'PASS' : 'FAIL'}`,
  '',
  `- Baseline: \`${bm.commit}\` (${BASE})`,
  `- Candidate: \`${cm.commit}\` (${CAND})`,
  `- Rule (${RULE.mode}): pixelmatch threshold ${RULE.pixelmatch.threshold}, includeAA ${RULE.pixelmatch.includeAA}, <= ${(MAX_DIFF_RATIO * 100).toFixed(3)}% differing px per image, identical dimensions, identical masks`,
  `- Counts: ${Object.entries(counts).map(([k, v]) => `${k}=${v}`).join(', ')}`,
  `- Total differing pixels: ${summary.totalDiffPixels}`,
  ...(envMismatch.length ? ['', '## Environment mismatch (results not comparable)', '', ...envMismatch.map((m) => `- ${m.key}: baseline \`${JSON.stringify(m.baseline)}\` vs candidate \`${JSON.stringify(m.candidate)}\``)] : []),
  ...(warnings.length ? ['', '## Warnings', '', ...warnings.map((w) => `- ${w}`)] : []),
  '',
  '## By suite',
  '',
  '| suite/theme | total | pass | fail | differing px |',
  '|---|---|---|---|---|',
  ...Object.entries(bySuite).map(([k, v]) => `| ${k} | ${v.total} | ${v.pass} | ${v.fail} | ${v.diffPixels} |`),
  '',
  '## Failing entries',
  '',
  ...(failing.length
    ? ['| id | status | differing px | ratio | sizes | diff image |', '|---|---|---|---|---|---|', ...failing.map(row)]
    : ['None.']),
  '',
  '## Non-zero entries within tolerance',
  '',
  ...(withinTolerance.length ? ['| id | status | differing px | ratio | sizes | diff image |', '|---|---|---|---|---|---|', ...withinTolerance.map(row)] : ['None.']),
  '',
];
fs.writeFileSync(path.join(OUT, 'summary.md'), md.join('\n'));

console.log(`${summary.pass ? 'PASS' : 'FAIL'} [${RULE.mode}] ${JSON.stringify(counts)} totalDiffPixels=${summary.totalDiffPixels}`);
for (const [k, v] of Object.entries(bySuite)) {
  console.log(`  ${k}: ${v.pass}/${v.total} pass, ${v.diffPixels} px`);
}
for (const r of failing.slice(0, 40)) {
  console.log(`  FAIL ${r.id} ${r.status} ${r.diffPixels ?? ''}`);
}
if (envMismatch.length) {
  console.log('  ENV MISMATCH', JSON.stringify(envMismatch));
}
process.exit(summary.pass ? 0 : 1);
