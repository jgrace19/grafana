/* eslint-disable */
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
      const next = prefix ? `${prefix}-${key}` : key;
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
    flat[`spacing_${key}`] = (sp as unknown as Record<string, string>)[key];
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
