#!/usr/bin/env node
/**
 * Fails if Emotion / useStyles2 usage in core code increases vs ratchet baseline.
 */
import fs from 'node:fs';
import path from 'node:path';
import { globSync } from 'glob';

const root = path.resolve(import.meta.dirname, '../..');
const baselinePath = path.join(root, 'docs/stylex-migration/emotion-ratchet-baseline.json');

const scanRoots = ['public/app', 'public/app/plugins', 'packages'];
const exclude = [
  '**/node_modules/**',
  '**/dist/**',
  'packages/grafana-ui/src/themes/compat/**',
  'packages/grafana-ui/src/themes/ThemeContext.tsx',
];

function countPattern(pattern) {
  let total = 0;
  for (const base of scanRoots) {
    const files = globSync(`${base}/**/*.{ts,tsx}`, { cwd: root, ignore: exclude });
    for (const f of files) {
      const text = fs.readFileSync(path.join(root, f), 'utf8');
      const m = text.match(new RegExp(pattern, 'g'));
      if (m) {
        total += m.length;
      }
    }
  }
  return total;
}

function countEmotionImportFiles() {
  let total = 0;
  for (const base of scanRoots) {
    const files = globSync(`${base}/**/*.{ts,tsx}`, { cwd: root, ignore: exclude });
    for (const f of files) {
      const text = fs.readFileSync(path.join(root, f), 'utf8');
      if (/@emotion\//.test(text)) {
        total += 1;
      }
    }
  }
  return total;
}

const current = {
  emotionImportFiles: countEmotionImportFiles(),
  useStyles2Calls: countPattern(String.raw`useStyles2\(`),
  capturedAt: new Date().toISOString(),
};

if (!fs.existsSync(baselinePath)) {
  fs.mkdirSync(path.dirname(baselinePath), { recursive: true });
  fs.writeFileSync(baselinePath, JSON.stringify(current, null, 2));
  console.log(`Created ratchet baseline at ${baselinePath}`);
  process.exit(0);
}

const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
let failed = false;

for (const key of ['emotionImportFiles', 'useStyles2Calls']) {
  if (current[key] > baseline[key]) {
    console.error(`Ratchet failed: ${key} ${current[key]} > baseline ${baseline[key]}`);
    failed = true;
  } else {
    console.log(`OK ${key}: ${current[key]} (baseline ${baseline[key]})`);
  }
}

if (failed) {
  process.exit(1);
}

// Ratchet down when counts decrease
const next = { ...baseline };
for (const key of ['emotionImportFiles', 'useStyles2Calls']) {
  if (current[key] < baseline[key]) {
    next[key] = current[key];
  }
}
if (JSON.stringify(next) !== JSON.stringify(baseline)) {
  fs.writeFileSync(baselinePath, JSON.stringify({ ...next, updatedAt: current.capturedAt }, null, 2));
  console.log('Updated ratchet baseline (counts decreased).');
}
