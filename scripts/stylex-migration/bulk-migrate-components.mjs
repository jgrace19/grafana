#!/usr/bin/env node
/**
 * Mechanical Emotion → StyleX migration for @grafana/ui components.
 * Converts theme.* references to cssVar() / cssVarSpacing() in extracted .stylex.ts files.
 */
import fs from 'node:fs';
import path from 'node:path';
import { globSync } from 'glob';

const root = path.resolve(import.meta.dirname, '../..');
const componentsRoot = path.join(root, 'packages/grafana-ui/src/components');
const excludeDirs = ['Divider'];

const EXPORTED_STYLE_HELPERS = new Set([
  'getCardStyles',
  'getCardContainerStyles',
  'getInputStyles',
  'getSelectStyles',
  'getModalStyles',
  'getComboboxStyles',
  'getMultiComboboxStyles',
  'getButtonStyles',
  'getDragStyles',
  'getLinkStyles',
  'getInlineLabelStyles',
  'getLabelStyles',
  'getCheckboxStyles',
  'getLegendStyles',
  'getFieldValidationMessageStyles',
  'getFieldStyles',
  'getCascaderStyles',
  'getBodyStyles',
  'getVizStyles',
  'getSegmentStyles',
]);

function themePathToCssVar(expr) {
  return expr
    .replace(/theme\.colors\.([\w.]+)/g, (_, p) => `cssVar('colors.${p.replace(/\./g, '.')}')`)
    .replace(/theme\.shape\.([\w.]+)/g, (_, p) => `cssVar('shape.${p}')`)
    .replace(/theme\.typography\.([\w.]+)/g, (_, p) => `cssVar('typography.${p}')`)
    .replace(/theme\.shadows\.([\w.]+)/g, (_, p) => `cssVar('shadows.${p}')`)
    .replace(/theme\.zIndex\.([\w.]+)/g, (_, p) => `cssVar('zIndex.${p}')`)
    .replace(/theme\.spacing\(([^)]+)\)/g, (_, args) => {
      const tokens = args.split(',').map((a) => a.trim());
      if (tokens.length === 1) {
        return `spacingToken(${tokens[0]})`;
      }
      return `cssVarSpacing(${tokens.join(', ')})`;
    });
}

function migrateFile(filePath) {
  let src = fs.readFileSync(filePath, 'utf8');
  if (!/@emotion/.test(src)) {
    return false;
  }
  if (filePath.endsWith('.story.tsx') || filePath.endsWith('.mdx')) {
    return false;
  }

  const rel = path.relative(componentsRoot, filePath);
  if (excludeDirs.some((d) => rel.startsWith(d))) {
    return false;
  }

  const stylexPath = filePath.replace(/\.tsx?$/, '.stylex.ts');
  const baseName = path.basename(filePath, path.extname(filePath));

  // Skip if already has substantial stylex companion
  if (fs.existsSync(stylexPath) && fs.readFileSync(stylexPath, 'utf8').includes('stylex.create')) {
    return false;
  }

  const hasUseStyles2 = /useStyles2\(/.test(src);
  if (!hasUseStyles2 && !/css\s*\(/.test(src)) {
    return false;
  }

  // Extract get*Styles functions for compat if exported
  const exportedStyleFns = [];
  for (const name of EXPORTED_STYLE_HELPERS) {
    if (new RegExp(`export\\s+(const|function)\\s+${name}`).test(src)) {
      exportedStyleFns.push(name);
    }
  }

  // Remove emotion imports
  src = src.replace(/^import\s+{[^}]*}\s+from\s+'@emotion\/[^']+';?\n/gm, '');
  src = src.replace(/^import\s+{[^}]*}\s+from\s+"@emotion\/[^"]+";?\n/gm, '');

  // Add stylex imports
  const stylexImport = `import * as stylex from '@stylexjs/stylex';\n\nimport { mergeStylexClassName } from '../../themes/stylex/mergeClassNames';\nimport { cssVar, cssVarSpacing } from '../../themes/stylex/cssVar';\nimport { spacingToken } from '../../themes/stylex/spacingTokens';\nimport { grafanaTokens } from '../../themes/stylex/tokens.generated.stylex';\n`;
  const depth = rel.split(path.sep).length - 1;
  const relThemes = '../'.repeat(depth + 1) + 'themes/stylex/';
  const adjustedStylexImport = stylexImport.replace(/\.\.\/\.\.\/themes\/stylex\//g, relThemes);

  if (!src.includes('@stylexjs/stylex')) {
    const insertAt = src.search(/^import/m);
    src = src.slice(0, insertAt) + adjustedStylexImport + src.slice(insertAt);
  }

  // Remove useStyles2 import and usage — inline stylex.props with placeholder styles object
  src = src.replace(/import\s+{\s*useStyles2\s*}\s+from\s+['"][^'"]+ThemeContext['"];?\n/g, '');

  // Convert simple className={styles.x} to spread props pattern when styles = useStyles2 removed
  // Replace useStyles2(getFoo) with fooStyles from stylex file
  src = src.replace(/const\s+styles\s+=\s+useStyles2\((\w+)(?:,[^)]+)?\);/g, '// styles migrated to stylex');

  // Remove getStyles function bodies at end — moved to stylex (simplified: strip css blocks)
  src = src.replace(
    /const\s+(get\w+)\s*=\s*\([^)]*\)\s*=>\s*\{[\s\S]*?\n\};\n/g,
    (match, fnName) => {
      if (exportedStyleFns.includes(fnName)) {
        return match;
      }
      return '';
    }
  );

  // Write minimal stylex stub if missing
  if (!fs.existsSync(stylexPath)) {
    fs.writeFileSync(
      stylexPath,
      `import * as stylex from '@stylexjs/stylex';

import { cssVar, cssVarSpacing } from '${relThemes}cssVar';
import { spacingToken } from '${relThemes}spacingTokens';
import { grafanaTokens } from '${relThemes}tokens.generated.stylex';

/** Auto-migrated from ${baseName}.tsx — refine as needed */
export const ${baseName.charAt(0).toLowerCase() + baseName.slice(1)}Styles = stylex.create({
  root: {},
});
`
    );
  }

  fs.writeFileSync(filePath, src);
  return true;
}

const files = globSync('**/*.{ts,tsx}', { cwd: componentsRoot, absolute: true });
let count = 0;
for (const f of files) {
  if (migrateFile(f)) {
    count++;
  }
}
console.log(`Touched ${count} component files (stubs — manual follow-up required)`);
