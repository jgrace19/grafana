#!/usr/bin/env node
/**
 * Emits static global CSS from existing GlobalStyles emotion helpers, replacing
 * concrete theme values with --grafana-* CSS variables.
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import createCache from '@emotion/cache';
import createEmotionServer from '@emotion/server/create-instance';
import { Global, css } from '@emotion/react';
import React from 'react';
import { renderToString } from 'react-dom/server';

import { createTheme } from '@grafana/data';

const root = path.resolve(import.meta.dirname, '../..');
const globalDir = path.join(root, 'packages/grafana-ui/src/themes/stylex/global');
const tokensPath = path.join(root, 'packages/grafana-ui/src/themes/stylex/tokens.generated.stylex.ts');

const tokenSourceToVar = new Map();
const tokenText = fs.readFileSync(tokensPath, 'utf8');
for (const match of tokenText.matchAll(
  /^\s+(\w+):\s*"((?:\\.|[^"\\])*)",\s*\/\/\s*(--grafana-[\w-]+)/gm
)) {
  tokenSourceToVar.set(match[2], match[3]);
}

function replaceValuesWithVars(cssText) {
  let out = cssText;
  const entries = [...tokenSourceToVar.entries()].sort((a, b) => b[0].length - a[0].length);
  for (const [value, varName] of entries) {
    const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    out = out.replace(new RegExp(escaped, 'g'), `var(${varName})`);
  }
  return out;
}

const modules = [
  { file: 'accessibility.ts', export: 'getAccessibilityStyles' },
  { file: 'alerting.ts', export: 'getAlertingStyles' },
  { file: 'card.ts', export: 'getCardStyles' },
  { file: 'code.ts', export: 'getCodeStyles' },
  { file: 'dashboardGrid.ts', export: 'getDashboardGridStyles' },
  { file: 'dashdiff.ts', export: 'getDashDiffStyles' },
  { file: 'elements.ts', export: 'getElementStyles' },
  { file: 'extra.ts', export: 'getExtraStyles' },
  { file: 'filterTable.ts', export: 'getFilterTableStyles' },
  { file: 'fonts.ts', export: 'getFontStyles' },
  { file: 'forms.ts', export: 'getFormElementStyles' },
  { file: 'hacks.ts', export: 'getHacksStyles' },
  { file: 'jsonFormatter.ts', export: 'getJsonFormatterStyles' },
  { file: 'legacySelect.ts', export: 'getLegacySelectStyles' },
  { file: 'markdownStyles.ts', export: 'getMarkdownStyles' },
  { file: 'page.ts', export: 'getPageStyles' },
  { file: 'queryEditor.ts', export: 'getQueryEditorStyles' },
  { file: 'skeletonStyles.ts', export: 'getSkeletonStyles' },
  { file: 'slate.ts', export: 'getSlateStyles' },
  { file: 'uPlot.ts', export: 'getUplotStyles' },
  { file: 'utilityClasses.ts', export: 'getUtilityClassStyles' },
];

const theme = createTheme({ colors: { mode: 'light' } });
const cache = createCache({ key: 'grafana-global' });
const { extractCriticalToChunks } = createEmotionServer(cache);
const cssChunks = [];

for (const mod of modules) {
  const modPath = path.join(root, 'packages/grafana-ui/src/themes/GlobalStyles', mod.file);
  const loaded = await import(pathToFileURL(modPath).href);
  const fn = loaded[mod.export];
  if (!fn) {
    throw new Error(`Missing export ${mod.export} in ${mod.file}`);
  }
  const args = mod.export === 'getHacksStyles' ? [{}] : [theme];
  const serialized = fn(...args);
  const html = renderToString(
    React.createElement(Global, { styles: serialized })
  );
  const chunks = extractCriticalToChunks(html);
  const chunkCss = chunks.styles.map((s) => s.css).join('\n');
  const name = mod.file.replace(/\.ts$/, '.css');
  const body = replaceValuesWithVars(chunkCss);
  cssChunks.push({ name, body });
}

fs.mkdirSync(globalDir, { recursive: true });

for (const { name, body } of cssChunks) {
  fs.writeFileSync(
    path.join(globalDir, name),
    `/* GENERATED — node scripts/stylex-migration/emit-global-css.mjs */\n@layer grafana-global {\n${body}\n}\n`
  );
}

const indexImports = cssChunks.map(({ name }) => `@import './${name}';`).join('\n');
fs.writeFileSync(
  path.join(globalDir, 'index.css'),
  `/* Grafana global styles (CSS variables: --grafana-*) */\n${indexImports}\n`
);

console.log(`Wrote ${cssChunks.length} global CSS files to ${globalDir}`);
