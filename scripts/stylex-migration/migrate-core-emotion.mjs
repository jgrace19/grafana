#!/usr/bin/env node
/**
 * Mechanical Emotion → StyleX migration for public/app/core.
 * Converts theme.* references inside getStyles/css blocks to grafanaTokens / themeSpacing.
 */
import fs from 'node:fs';
import path from 'node:path';
import { globSync } from 'glob';

const root = path.resolve(import.meta.dirname, '../..');
const coreDir = path.join(root, 'public/app/core');

const TOKEN_KEYS = new Set(
  fs
    .readFileSync(path.join(root, 'packages/grafana-ui/src/themes/stylex/tokens.generated.stylex.ts'), 'utf8')
    .match(/^\s+([a-zA-Z0-9_]+):/gm)
    ?.map((line) => line.trim().replace(/:$/, '').split(':')[0].trim()) ?? []
);

function themePathToToken(expr) {
  const cleaned = expr.replace(/^theme\./, '').trim();
  const tokenKey = cleaned.replace(/\./g, '_');
  if (TOKEN_KEYS.has(tokenKey)) {
    return `grafanaTokens.${tokenKey}`;
  }
  return null;
}

function transformThemeRefs(text) {
  let out = text;

  // theme.spacing(a, b, c, d)
  out = out.replace(/theme\.spacing\(([^)]+)\)/g, (_, args) => {
    const parts = args.split(',').map((p) => p.trim());
    if (parts.length === 1) {
      const single = parts[0];
      if (/^['"]/.test(single)) {
        return single;
      }
      if (/^[\d.-]+$/.test(single)) {
        return `themeSpacing(${single})`;
      }
      if (single.includes('*')) {
        return `themeSpacing(${single})`;
      }
      return `themeSpacing(${single})`;
    }
    return `themeSpacingShorthand(${parts.join(', ')})`;
  });

  // theme.colors.* / theme.typography.* / theme.shape.* / theme.zIndex.* / theme.shadows.*
  out = out.replace(/theme\.((?:colors|typography|shape|zIndex|shadows)(?:\.[a-zA-Z0-9_]+)+)/g, (_, pathExpr) => {
    const token = themePathToToken(`theme.${pathExpr}`);
    if (token) {
      return token;
    }
    // components.* not in tokens — common fallbacks
    if (pathExpr === 'components.input.borderColor') {
      return 'grafanaTokens.colors_border_medium';
    }
    if (pathExpr === 'components.height.md') {
      return 'grafanaTokens.spacing_x4';
    }
    console.warn(`  Unmapped theme path: theme.${pathExpr}`);
    return `/* TODO theme.${pathExpr} */ 'inherit'`;
  });

  return out;
}

function camelToStylexExportName(filePath) {
  const base = path.basename(filePath, path.extname(filePath));
  return `${base.charAt(0).toLowerCase()}${base.slice(1)}Styles`;
}

function migrateFile(filePath) {
  let src = fs.readFileSync(filePath, 'utf8');
  if (!/@emotion\/|useStyles2/.test(src)) {
    return false;
  }

  const rel = path.relative(coreDir, filePath);
  const dir = path.dirname(filePath);
  const base = path.basename(filePath, path.extname(filePath));
  const stylexPath = path.join(dir, `${base}.stylex.ts`);
  const exportName = camelToStylexExportName(filePath);

  // Extract getStyles function if present
  const getStylesMatch = src.match(
    /const getStyles = \(([\s\S]*?)\) =>(?:\s*\{([\s\S]*?)\n\};|\s*(css\([\s\S]*?\)));/
  );

  let stylexBody = '';
  const styleKeys = [];

  if (getStylesMatch) {
    const params = getStylesMatch[1];
    const objectBody = getStylesMatch[2];
    const singleCss = getStylesMatch[3];

    if (objectBody) {
      const keyBlocks = [...objectBody.matchAll(/(\w+):\s*css\(\{([\s\S]*?)\}\)/g)];
      for (const [, key, block] of keyBlocks) {
        styleKeys.push(key);
        const transformed = transformThemeRefs(block);
        stylexBody += `  ${key}: {\n${indentBlock(transformed, 4)}\n  },\n`;
      }
    } else if (singleCss) {
      styleKeys.push('root');
      const block = singleCss.replace(/^css\(\{|\}\)$/g, '');
      stylexBody = `  root: {\n${indentBlock(transformThemeRefs(block), 4)}\n  },\n`;
    }

    if (stylexBody) {
      const stylexFile = `import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../stylex/spacing';

export const ${exportName} = stylex.create({
${stylexBody}});
`;
      // Fix relative import depth
      const depth = rel.split(path.sep).length - 2;
      const spacingImport = `${'../'.repeat(Math.max(depth, 0))}stylex/spacing`.replace(/\/\.\.\/stylex/, '/stylex');
      const fixedStylex = stylexFile.replace(
        "from '../../stylex/spacing'",
        `from '${depth <= 0 ? './stylex/spacing' : '../'.repeat(depth) + 'stylex/spacing'}'`
      );

      fs.writeFileSync(stylexPath, fixedStylex);

      // Remove getStyles from source
      src = src.replace(/const getStyles = [\s\S]*?;\n\n/, '');

      // Remove emotion imports
      src = src.replace(/import \{[^}]*\} from '@emotion\/css';\n/g, '');
      src = src.replace(/import \{[^}]*\} from '@emotion\/react';\n/g, '');
      src = src.replace(/import \{ type GrafanaTheme2[^}]*\} from '@grafana\/data';\n/g, '');
      src = src.replace(/, useStyles2/g, '');
      src = src.replace(/useStyles2, /g, '');
      src = src.replace(/import \{ useStyles2 \} from '@grafana\/ui';\n/g, '');

      // Add stylex imports
      if (!src.includes('@stylexjs/stylex') && /\bcx\(/.test(src)) {
        src = src.replace(/^/m, "import clsx from 'clsx';\n");
      }
      if (!src.includes('mergeStylexClassName')) {
        const needsMerge = /className=\{/.test(src);
        if (needsMerge) {
          src = src.replace(
            /^(import .* from '@grafana\/ui';?\n)/m,
            "$1import { mergeStylexClassName } from '@grafana/ui/unstable';\nimport * as stylex from '@stylexjs/stylex';\n"
          );
        }
      }

      const stylexImportPath = './' + `${base}.stylex`;
      if (!src.includes(stylexImportPath)) {
        src = src.replace(
          /^(import .*;\n)/,
          `import * as stylex from '@stylexjs/stylex';\nimport { mergeStylexClassName } from '@grafana/ui/unstable';\nimport { ${exportName} } from '${stylexImportPath}';\n$1`
        );
      }

      // Replace useStyles2(getStyles) patterns
      src = src.replace(/const styles = useStyles2\(getStyles(?:,[^)]+)?\);/g, '');

      // Replace styles.key with stylex.props
      for (const key of styleKeys) {
        src = src.replace(new RegExp(`className=\\{styles\\.${key}\\}`, 'g'), `{...stylex.props(${exportName}.${key})}`);
        src = src.replace(
          new RegExp(`className=\\{cx\\(([^)]*)styles\\.${key}([^)]*)\\)\\}`, 'g'),
          '{...mergeStylexClassName(stylex.props($1$2' + `${exportName}.${key}), undefined)}`
        );
      }

      if (styleKeys.length === 1 && styleKeys[0] === 'root') {
        src = src.replace(/className=\{styles\}/g, '{...stylex.props(' + exportName + '.root)}');
      }

      fs.writeFileSync(filePath, src);
      console.log(`Migrated ${rel} -> ${path.basename(stylexPath)}`);
      return true;
    }
  }

  return false;
}

function indentBlock(text, spaces) {
  const pad = ' '.repeat(spaces);
  return text
    .split('\n')
    .filter((l) => l.trim())
    .map((l) => pad + l.trim())
    .join('\n');
}

const files = globSync('**/*.{ts,tsx}', { cwd: coreDir, absolute: true });
let count = 0;
for (const f of files) {
  if (migrateFile(f)) {
    count++;
  }
}
console.log(`Attempted migration on ${count} files`);
