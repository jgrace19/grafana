import fs from 'node:fs';
import path from 'node:path';

import { createTheme } from '../../packages/grafana-data/src/themes/createTheme';
import { getBuiltInThemes } from '../../packages/grafana-data/src/themes/registry';

const rootDir = process.env.GRAFANA_ROOT ?? path.resolve(process.cwd());
const outDir = path.join(rootDir, 'packages/grafana-ui/src/themes/stylex');

type FlatVars = Record<string, string>;

function flattenObject(obj: unknown, prefix: string, out: FlatVars): void {
  if (obj === null || obj === undefined) {
    return;
  }
  if (typeof obj === 'string' || typeof obj === 'number') {
    out[prefix] = String(obj);
    return;
  }
  if (typeof obj === 'function') {
    return;
  }
  if (Array.isArray(obj)) {
    return;
  }
  if (typeof obj === 'object') {
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      const next = prefix ? `${prefix}-${key}` : key;
      flattenObject(value, next, out);
    }
  }
}

function collectThemeVars(theme: ReturnType<typeof createTheme>): FlatVars {
  const out: FlatVars = {};
  flattenObject(theme.colors, 'colors', out);
  flattenObject(theme.shape, 'shape', out);
  flattenObject(theme.typography, 'typography', out);
  flattenObject(theme.shadows, 'shadows', out);
  flattenObject(theme.zIndex, 'zIndex', out);
  // spacing is a callable function; export design tokens explicitly
  const sp = theme.spacing;
  for (const key of [
    'x0',
    'x0_25',
    'x0_5',
    'x1',
    'x1_5',
    'x2',
    'x2_5',
    'x3',
    'x4',
    'x5',
    'x6',
    'x8',
    'x10',
  ] as const) {
    out[`spacing_${key}`] = (sp as Record<string, string>)[key];
  }
  return out;
}

function toVarName(flatKey: string): string {
  return `--grafana-${flatKey.replace(/([A-Z])/g, '-$1').replace(/_/g, '-').toLowerCase()}`;
}

function toTokenExportKey(flatKey: string): string {
  return flatKey.replace(/[^a-zA-Z0-9]/g, '_');
}

function generateTokensFile(light: FlatVars, dark: FlatVars): string {
  const keys = Array.from(new Set([...Object.keys(light), ...Object.keys(dark)])).sort();
  const defineLines = keys.map((key) => {
    const exportKey = toTokenExportKey(key);
    const cssVar = toVarName(key);
    const lightVal = light[key] ?? 'initial';
    return `  ${exportKey}: ${JSON.stringify(lightVal)}, // ${cssVar}`;
  });

  return `/* eslint-disable */
/**
 * GENERATED FILE — do not edit. Run: yarn stylex:gen-tokens
 */
import * as stylex from '@stylexjs/stylex';

export const grafanaTokens = stylex.defineVars({
${defineLines.join('\n')}
});

export const grafanaDarkTheme = stylex.createTheme(grafanaTokens, {
${keys
  .map((key) => {
    const exportKey = toTokenExportKey(key);
    const darkVal = dark[key] ?? light[key] ?? 'initial';
    return `  ${exportKey}: ${JSON.stringify(darkVal)},`;
  })
  .join('\n')}
});

export const TOKEN_CSS_VAR_MAP: Record<string, string> = {
${keys.map((key) => `  '${toTokenExportKey(key)}': '${toVarName(key)}',`).join('\n')}
};
`;
}

function generateThemeToCssVarsHelper(): string {
  return `/* eslint-disable */
/**
 * GENERATED FILE — do not edit. Run: yarn stylex:gen-tokens
 */
import { type GrafanaTheme2 } from '@grafana/data';

import { TOKEN_CSS_VAR_MAP } from './tokens.generated.stylex';

type FlatVars = Record<string, string>;

function flattenObject(obj: unknown, prefix: string, out: FlatVars): void {
  if (obj === null || obj === undefined) {
    return;
  }
  if (typeof obj === 'string' || typeof obj === 'number') {
    out[prefix] = String(obj);
    return;
  }
  if (typeof obj === 'function' || Array.isArray(obj)) {
    return;
  }
  if (typeof obj === 'object') {
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      const next = prefix ? \`\${prefix}-\${key}\` : key;
      flattenObject(value, next, out);
    }
  }
}

function toTokenExportKey(flatKey: string): string {
  return flatKey.replace(/[^a-zA-Z0-9]/g, '_');
}

/** Maps a runtime GrafanaTheme2 to CSS custom properties consumed by StyleX tokens. */
export function themeToCssVars(theme: GrafanaTheme2): Record<string, string> {
  const flat: FlatVars = {};
  flattenObject(theme.colors, 'colors', flat);
  flattenObject(theme.shape, 'shape', flat);
  flattenObject(theme.typography, 'typography', flat);
  flattenObject(theme.shadows, 'shadows', flat);
  flattenObject(theme.zIndex, 'zIndex', flat);
  const sp = theme.spacing;
  for (const key of [
    'x0',
    'x0_25',
    'x0_5',
    'x1',
    'x1_5',
    'x2',
    'x2_5',
    'x3',
    'x4',
    'x5',
    'x6',
    'x8',
    'x10',
  ] as const) {
    flat[\`spacing_\${key}\`] = (sp as unknown as Record<string, string>)[key];
  }

  const cssVars: Record<string, string> = {};
  for (const [flatKey, cssVar] of Object.entries(TOKEN_CSS_VAR_MAP)) {
    const sourceKey = Object.keys(flat).find((k) => toTokenExportKey(k) === flatKey);
    if (sourceKey && flat[sourceKey] !== undefined) {
      cssVars[cssVar] = flat[sourceKey];
    }
  }
  return cssVars;
}
`;
}

function main() {
  const lightTheme = createTheme({ colors: { mode: 'light' } });
  const darkTheme = createTheme({ colors: { mode: 'dark' } });
  const lightVars = collectThemeVars(lightTheme);
  const darkVars = collectThemeVars(darkTheme);

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'tokens.generated.stylex.ts'), generateTokensFile(lightVars, darkVars));
  fs.writeFileSync(path.join(outDir, 'themeToCssVars.generated.ts'), generateThemeToCssVarsHelper());

  const registry = getBuiltInThemes([]);
  fs.writeFileSync(
    path.join(outDir, 'themes.meta.json'),
    JSON.stringify({ builtInThemeIds: registry.map((t) => t.id) }, null, 2)
  );
  console.log(`Wrote StyleX tokens (${Object.keys(lightVars).length} keys) to ${outDir}`);
}

main();
