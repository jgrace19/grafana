import fs from 'node:fs';
import path from 'node:path';

import { css } from '@emotion/react';
import { createTheme } from '@grafana/data';

import { getAccessibilityStyles } from '../../packages/grafana-ui/src/themes/GlobalStyles/accessibility';
import { getAlertingStyles } from '../../packages/grafana-ui/src/themes/GlobalStyles/alerting';
import { getCardStyles } from '../../packages/grafana-ui/src/themes/GlobalStyles/card';
import { getCodeStyles } from '../../packages/grafana-ui/src/themes/GlobalStyles/code';
import { getDashboardGridStyles } from '../../packages/grafana-ui/src/themes/GlobalStyles/dashboardGrid';
import { getDashDiffStyles } from '../../packages/grafana-ui/src/themes/GlobalStyles/dashdiff';
import { getElementStyles } from '../../packages/grafana-ui/src/themes/GlobalStyles/elements';
import { getExtraStyles } from '../../packages/grafana-ui/src/themes/GlobalStyles/extra';
import { getFilterTableStyles } from '../../packages/grafana-ui/src/themes/GlobalStyles/filterTable';
import { getFontStyles } from '../../packages/grafana-ui/src/themes/GlobalStyles/fonts';
import { getFormElementStyles } from '../../packages/grafana-ui/src/themes/GlobalStyles/forms';
import { getHacksStyles } from '../../packages/grafana-ui/src/themes/GlobalStyles/hacks';
import { getJsonFormatterStyles } from '../../packages/grafana-ui/src/themes/GlobalStyles/jsonFormatter';
import { getLegacySelectStyles } from '../../packages/grafana-ui/src/themes/GlobalStyles/legacySelect';
import { getMarkdownStyles } from '../../packages/grafana-ui/src/themes/GlobalStyles/markdownStyles';
import { getPageStyles } from '../../packages/grafana-ui/src/themes/GlobalStyles/page';
import { getQueryEditorStyles } from '../../packages/grafana-ui/src/themes/GlobalStyles/queryEditor';
import { getSkeletonStyles } from '../../packages/grafana-ui/src/themes/GlobalStyles/skeletonStyles';
import { getSlateStyles } from '../../packages/grafana-ui/src/themes/GlobalStyles/slate';
import { getUplotStyles } from '../../packages/grafana-ui/src/themes/GlobalStyles/uPlot';
import { getUtilityClassStyles } from '../../packages/grafana-ui/src/themes/GlobalStyles/utilityClasses';

const root = path.resolve(process.env.GRAFANA_ROOT ?? process.cwd());
const globalDir = path.join(root, 'packages/grafana-ui/src/themes/stylex/global');
const tokensPath = path.join(root, 'packages/grafana-ui/src/themes/stylex/tokens.generated.stylex.ts');

const tokenSourceToVar = new Map<string, string>();
const tokenText = fs.readFileSync(tokensPath, 'utf8');
for (const match of tokenText.matchAll(
  /^\s+(\w+):\s*"((?:\\.|[^"\\])*)",\s*\/\/\s*(--grafana-[\w-]+)/gm
)) {
  tokenSourceToVar.set(match[2], match[3]);
}

function replaceValuesWithVars(cssText: string) {
  let out = cssText;
  const entries = [...tokenSourceToVar.entries()].sort((a, b) => b[0].length - a[0].length);
  for (const [value, varName] of entries) {
    const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    out = out.replace(new RegExp(escaped, 'g'), `var(${varName})`);
  }
  return out;
}

type StyleChunk = { name: string; serialized: ReturnType<typeof css> };

const theme = createTheme({ colors: { mode: 'light' } });

const chunks: StyleChunk[] = [
  { name: 'accessibility.css', serialized: getAccessibilityStyles(theme) },
  { name: 'alerting.css', serialized: getAlertingStyles(theme) },
  { name: 'card.css', serialized: getCardStyles(theme) },
  { name: 'code.css', serialized: getCodeStyles(theme) },
  { name: 'dashboardGrid.css', serialized: getDashboardGridStyles(theme) },
  { name: 'dashdiff.css', serialized: getDashDiffStyles(theme) },
  { name: 'elements.css', serialized: getElementStyles(theme) },
  { name: 'extra.css', serialized: getExtraStyles(theme) },
  { name: 'filterTable.css', serialized: getFilterTableStyles(theme) },
  { name: 'fonts.css', serialized: getFontStyles(theme) },
  { name: 'forms.css', serialized: getFormElementStyles(theme) },
  { name: 'hacks.css', serialized: getHacksStyles({}) },
  { name: 'jsonFormatter.css', serialized: getJsonFormatterStyles(theme) },
  { name: 'legacySelect.css', serialized: getLegacySelectStyles(theme) },
  { name: 'markdownStyles.css', serialized: getMarkdownStyles(theme) },
  { name: 'page.css', serialized: getPageStyles(theme) },
  { name: 'queryEditor.css', serialized: getQueryEditorStyles(theme) },
  { name: 'skeletonStyles.css', serialized: getSkeletonStyles(theme) },
  { name: 'slate.css', serialized: getSlateStyles(theme) },
  { name: 'uPlot.css', serialized: getUplotStyles(theme) },
  { name: 'utilityClasses.css', serialized: getUtilityClassStyles(theme) },
];

fs.mkdirSync(globalDir, { recursive: true });

for (const { name, serialized } of chunks) {
  const body = replaceValuesWithVars(serialized.styles);
  fs.writeFileSync(
    path.join(globalDir, name),
    `/* GENERATED — yarn stylex:emit-global-css */\n@layer grafana-global {\n${body}\n}\n`
  );
}

const indexImports = chunks.map(({ name }) => `@import './${name}';`).join('\n');
fs.writeFileSync(
  path.join(globalDir, 'index.css'),
  `/* Grafana global styles (CSS variables: --grafana-*) */\n${indexImports}\n`
);

console.log(`Wrote ${chunks.length} global CSS files to ${globalDir}`);
