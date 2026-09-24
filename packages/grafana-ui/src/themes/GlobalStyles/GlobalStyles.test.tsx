import { render } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { createTheme, getThemeById, ThemeContext } from '@grafana/data';

import { themeToCssVars } from '../stylex/themeToCssVars';

import { GlobalStyles } from './GlobalStyles';
import { getGlobalThemeVars } from './globalThemeVars';

const readSheet = (file: string) =>
  readFileSync(resolve(__dirname, file), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/'[^']*'|"[^"]*"/g, "''");
const layered = readSheet('GlobalStyles.global.css');

/** Preludes of the top-level blocks (`@layer x`, `.selector`) of a comment- and string-free sheet. */
function topLevelPreludes(css: string) {
  const preludes: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < css.length; i++) {
    if (css[i] === '{') {
      if (depth === 0) {
        preludes.push(css.slice(start, i).trim());
      }
      depth++;
    } else if (css[i] === '}') {
      depth--;
      if (depth === 0) {
        start = i + 1;
      }
    }
  }
  expect(depth).toBe(0);
  expect(css.slice(start).trim()).toBe('');
  return preludes;
}

const usedVars = (css: string) => new Set([...css.matchAll(/var\((--[\w-]+)\)/g)].map(([, name]) => name));

describe('GlobalStyles.global.css', () => {
  it('keeps every rule inside a grafana-global layer block', () => {
    const preludes = topLevelPreludes(layered);

    expect(preludes.length).toBeGreaterThan(10);
    expect(new Set(preludes)).toEqual(new Set(['@layer grafana-global']));
  });

  it('layers the disabled/read-only form field rules like every other global rule', () => {
    // Every top-level block of this sheet is a grafana-global layer (see the test above).
    expect(layered).toMatch(/input\[disabled\],\s*select\[disabled\],\s*textarea\[disabled\],\s*input\[readonly\]/);
  });

  it.each(['dark', 'light', 'debug', 'matrix'])('only references custom properties the %s theme defines', (id) => {
    const theme = getThemeById(id);
    const defined = new Set([...Object.keys(themeToCssVars(theme)), ...Object.keys(getGlobalThemeVars(theme))]);

    for (const name of usedVars(layered)) {
      expect(defined).toContain(name);
    }
  });
});

describe('GlobalStyles', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('style');
  });

  it('writes the derived global values onto <html> and follows theme changes', () => {
    const dark = createTheme();
    const light = createTheme({ colors: { mode: 'light' } });
    const rootStyle = document.documentElement.style;

    const { rerender } = render(
      <ThemeContext.Provider value={dark}>
        <GlobalStyles />
      </ThemeContext.Provider>
    );
    expect(rootStyle.getPropertyValue('--gf-global-color-scheme')).toBe('dark');
    expect(rootStyle.getPropertyValue('--gf-global-json-string')).toBe('#23d662');

    rerender(
      <ThemeContext.Provider value={light}>
        <GlobalStyles />
      </ThemeContext.Provider>
    );
    expect(rootStyle.getPropertyValue('--gf-global-color-scheme')).toBe('light');
    expect(rootStyle.getPropertyValue('--gf-global-json-string')).toBe('green');
  });

  it('registers the web fonts from the runtime public path', () => {
    const added: Array<{ family: string; source: string; descriptors: FontFaceDescriptors }> = [];
    class FakeFontFace {
      constructor(family: string, source: string, descriptors: FontFaceDescriptors) {
        added.push({ family, source, descriptors });
      }
    }
    const add = jest.fn();
    Object.defineProperty(window, 'FontFace', { value: FakeFontFace, configurable: true });
    Reflect.set(document.fonts, 'add', add);
    window.__grafana_public_path__ = 'https://cdn.example/grafana/public/';

    try {
      jest.isolateModules(() => {
        const { registerFonts } = jest.requireActual('./fonts');
        registerFonts();
        registerFonts();
      });
    } finally {
      Reflect.deleteProperty(window, 'FontFace');
      Reflect.deleteProperty(window, '__grafana_public_path__');
      Reflect.deleteProperty(document.fonts, 'add');
    }

    expect(add).toHaveBeenCalledTimes(6);
    expect(added).toHaveLength(6);
    expect(added[2]).toEqual({
      family: 'Inter',
      source: "url('https://cdn.example/grafana/public/fonts/inter/Inter-Regular.woff2') format('woff2')",
      descriptors: { style: 'normal', weight: '400', display: 'swap' },
    });
    expect(added[0].descriptors.unicodeRange).toMatch(/^U\+0000-00FF/);
  });
});
