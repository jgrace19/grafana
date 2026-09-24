#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '../..');
const baselinePath = path.join(root, 'docs/stylex-migration/baseline.json');
const budgetsPath = path.join(root, 'docs/stylex-migration/budgets.json');

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

if (!fs.existsSync(baselinePath)) {
  console.error(`Missing baseline at ${baselinePath}. Run yarn stylex:baseline first.`);
  process.exit(1);
}

const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
const budgets = JSON.parse(fs.readFileSync(budgetsPath, 'utf8'));
const app = findLargestBuildAsset('app.');
const current = { appJsBytes: app?.size ?? null };

let failed = false;
if (baseline.appJsBytes && current.appJsBytes) {
  const ratio = current.appJsBytes / baseline.appJsBytes;
  console.log(`app.js size ratio: ${ratio.toFixed(3)} (${current.appJsBytes} / ${baseline.appJsBytes})`);
  if (ratio > budgets.jsBundleSizeRatio) {
    console.error(`Bundle budget exceeded (max ${budgets.jsBundleSizeRatio})`);
    failed = true;
  }
} else {
  console.warn('Skipping bundle comparison — build artifacts or baseline appJsBytes missing.');
}

process.exit(failed ? 1 : 0);
