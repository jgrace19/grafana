/**
 * Safe Emotion → StyleX migration for simple getStyles patterns in @grafana/ui components.
 */
import fs from 'node:fs';
import path from 'node:path';

import { globSync } from 'glob';

const root = path.resolve(process.env.GRAFANA_ROOT ?? process.cwd());
const componentsRoot = path.join(root, 'packages/grafana-ui/src/components');

const SKIP = new Set([
  'Divider/Divider.tsx',
  'Text/Text.tsx',
  'Badge/Badge.tsx',
  'Spinner/Spinner.tsx',
  'Card/Card.tsx',
  'Card/CardContainer.tsx',
  'ThemeDemos/EmotionPerfTest.tsx',
]);

const UNSAFE_MARKERS = [
  'theme.transitions.create',
  '...getFocusStyles',
  'getFocusStyles(',
  'theme.colors.emphasize',
  'tinycolor',
  'stylesFactory',
  'memoize(',
  'css([',
  'keyframes',
  'animation:',
  'animationName',
  'Object.fromEntries',
  'Array.from',
  '`',
  'getIntermediateValue',
];

function depthToThemes(rel: string) {
  const depth = rel.split('/').length - 1;
  return '../'.repeat(depth + 1) + 'themes/stylex/';
}

function convertThemeRefs(body: string): string {
  let out = body;
  out = out.replace(/theme\.spacing\(([^)]+)\)/g, (_, args) => {
    const parts = args.split(',').map((p: string) => p.trim());
    if (parts.length === 1) {
      return `spacingToken(${parts[0]})`;
    }
    return `cssVarSpacing(${parts.join(', ')})`;
  });
  out = out.replace(/theme\.colors\.([\w.]+)/g, (_, p) => `cssVar('colors.${p}')`);
  out = out.replace(/theme\.shape\.([\w.]+)/g, (_, p) => `cssVar('shape.${p}')`);
  out = out.replace(/theme\.typography\.([\w.]+)/g, (_, p) => `cssVar('typography.${p}')`);
  out = out.replace(/theme\.shadows\.([\w.]+)/g, (_, p) => `cssVar('shadows.${p}')`);
  out = out.replace(/theme\.zIndex\.([\w.]+)/g, (_, p) => `cssVar('zIndex.${p}')`);
  return out;
}

function migrateFile(absPath: string): boolean {
  const rel = path.relative(componentsRoot, absPath);
  if (SKIP.has(rel) || rel.endsWith('.story.tsx') || rel.endsWith('.mdx') || rel.endsWith('.test.tsx')) {
    return false;
  }

  let src = fs.readFileSync(absPath, 'utf8');
  if (!/@emotion/.test(src) || !/useStyles2\(get\w+/.test(src)) {
    return false;
  }

  const getStylesMatch = src.match(/const\s+(get\w+)\s*=\s*\(theme[^)]*\)\s*=>\s*\{([\s\S]*?)\n\};/);
  if (!getStylesMatch) {
    return false;
  }

  const fnBody = getStylesMatch[2];
  if (UNSAFE_MARKERS.some((m) => fnBody.includes(m))) {
    return false;
  }

  const cssBlocks: Array<{ key: string; body: string }> = [];
  const cssKeyRegex = /(\w+):\s*css\(\s*(\{[\s\S]*?\})\s*\)/g;
  let cssMatch;
  while ((cssMatch = cssKeyRegex.exec(fnBody)) !== null) {
    if (UNSAFE_MARKERS.some((m) => cssMatch![2].includes(m))) {
      return false;
    }
    cssBlocks.push({ key: cssMatch[1], body: convertThemeRefs(cssMatch[2]) });
  }

  if (cssBlocks.length === 0) {
    return false;
  }

  const stylexSource = cssBlocks.map(({ body }) => body).join('\n');
  if (/theme\.|\bfirstDot\b|\bsecondDot\b|\bthirdDot\b/.test(stylexSource)) {
    return false;
  }

  const base = path.basename(absPath, path.extname(absPath));
  const stylexPath = absPath.replace(/\.tsx?$/, '.stylex.ts');
  const themesRel = depthToThemes(rel);
  const exportName = `${base.charAt(0).toLowerCase()}${base.slice(1)}Styles`;
  const styleFn = `${base.charAt(0).toLowerCase()}${base.slice(1)}StyleProps`;

  const styleEntries = cssBlocks.map(({ key, body }) => `  ${key}: ${body},`).join('\n');
  fs.writeFileSync(
    stylexPath,
    `import * as stylex from '@stylexjs/stylex';

import { cssVar, cssVarSpacing } from '${themesRel}cssVar';
import { spacingToken } from '${themesRel}spacingTokens';

export const ${exportName} = stylex.create({
${styleEntries}
});

export function ${styleFn}(key: keyof typeof ${exportName}) {
  return stylex.props(${exportName}[key]);
}
`
  );

  if (!src.includes('@stylexjs/stylex')) {
    const imports = `import * as stylex from '@stylexjs/stylex';

import { mergeStylexClassName } from '${themesRel}mergeClassNames';
import { ${exportName}, ${styleFn} } from './${base}.stylex';

`;
    src = imports + src;
  }

  src = src.replace(/^import\s+{[^}]*}\s+from\s+'@emotion\/[^']+';?\n/gm, '');
  src = src.replace(/import\s+{\s*useStyles2\s*}\s+from\s+['"][^'"]+ThemeContext['"];?\n/g, '');
  src = src.replace(/const\s+styles\s+=\s+useStyles2\(get\w+\);?\n/g, '');

  for (const { key } of cssBlocks) {
    src = src.replaceAll(`className={styles.${key}}`, `{...${styleFn}('${key}')}`);
    src = src.replaceAll(`className={cx(styles.${key}`, `{...mergeStylexClassName(${styleFn}('${key}')`);
  }

  src = src.replace(/const\s+get\w+\s*=\s*\(theme[^)]*\)\s*=>\s*\{[\s\S]*?\n\};\n/, '');

  fs.writeFileSync(absPath, src);
  return true;
}

const files = globSync('**/*.{ts,tsx}', { cwd: componentsRoot, absolute: true });
let n = 0;
for (const f of files) {
  if (migrateFile(f)) {
    n++;
  }
}
console.log(`Safely migrated ${n} component files`);
