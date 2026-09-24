#!/usr/bin/env node
import { buildSync } from 'esbuild';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '../..');
const entry = path.join(root, 'scripts/stylex-migration/generate-theme-tokens.ts');
const outfile = path.join(root, 'tmp/stylex-generate-tokens.cjs');

fs.mkdirSync(path.dirname(outfile), { recursive: true });

buildSync({
  entryPoints: [entry],
  bundle: true,
  platform: 'node',
  outfile,
  packages: 'external',
  tsconfig: path.join(root, 'tsconfig.json'),
  conditions: ['@grafana-app/source'],
});

const result = spawnSync('node', [outfile], {
  cwd: root,
  stdio: 'inherit',
  env: { ...process.env, GRAFANA_ROOT: root },
});
process.exit(result.status ?? 1);
