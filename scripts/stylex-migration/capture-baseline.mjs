#!/usr/bin/env node
/**
 * Captures build/bundle baseline metrics for the StyleX migration.
 * Usage: node scripts/stylex-migration/capture-baseline.mjs [--out docs/stylex-migration/baseline.json]
 */
import { execSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '../..');
const outArg = process.argv.indexOf('--out');
const outPath =
  outArg >= 0 ? path.resolve(process.argv[outArg + 1]) : path.join(root, 'docs/stylex-migration/baseline.json');

function run(cmd, opts = {}) {
  const start = Date.now();
  spawnSync(cmd, { shell: true, cwd: root, stdio: 'inherit', ...opts });
  return Date.now() - start;
}

function fileSizeIfExists(rel) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) {
    return null;
  }
  return fs.statSync(p).size;
}

function findLargestBuildAsset(prefix) {
  const dir = path.join(root, 'public/build');
  if (!fs.existsSync(dir)) {
    return null;
  }
  let best = null;
  for (const name of fs.readdirSync(dir)) {
    if (!name.startsWith(prefix) || !name.endsWith('.js')) {
      continue;
    }
    const size = fs.statSync(path.join(dir, name)).size;
    if (!best || size > best.size) {
      best = { name, size };
    }
  }
  return best;
}

const metrics = {
  capturedAt: new Date().toISOString(),
  gitSha: execSync('git rev-parse HEAD', { cwd: root, encoding: 'utf8' }).trim(),
  jestUnitMs: null,
  webpackProdBuildMs: null,
  appJsBytes: null,
  darkCssBytes: fileSizeIfExists('public/build/grafana.dark.css'),
  lightCssBytes: fileSizeIfExists('public/build/grafana.light.css'),
  notes: [],
};

console.log('Running Jest smoke (packages/grafana-ui Divider test if present)...');
const jestStart = Date.now();
const jest = spawnSync(
  'yarn jest --no-watch packages/grafana-ui/src/components/Divider --passWithNoTests',
  { shell: true, cwd: root, stdio: 'inherit' }
);
metrics.jestUnitMs = Date.now() - jestStart;
if (jest.status !== 0) {
  metrics.notes.push('jest smoke failed or skipped');
}

console.log('Running production webpack build (this may take several minutes)...');
metrics.webpackProdBuildMs = run('yarn build', { stdio: 'inherit' });

const app = findLargestBuildAsset('app.');
if (app) {
  metrics.appJsBytes = app.size;
  metrics.appJsFile = app.name;
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(metrics, null, 2));
console.log(`Wrote baseline to ${outPath}`);
