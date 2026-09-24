import { useInsertionEffect, useMemo } from 'react';

import { type GrafanaTheme2 } from '@grafana/data';

import { getThemeCssText } from './cssVariables';

export const THEME_VARIABLES_ELEMENT_ATTRIBUTE = 'data-grafana-theme-variables';

// Each mounted provider registers its CSS text; the most recently mounted one is applied. This keeps a nested
// provider from leaving stale variables behind after it unmounts.
const activeEntries = new Map<symbol, string>();
let styleElement: HTMLStyleElement | null = null;

function render() {
  const entries = Array.from(activeEntries.values());
  const cssText = entries[entries.length - 1];

  if (cssText === undefined) {
    styleElement?.remove();
    styleElement = null;
    return;
  }

  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.setAttribute(THEME_VARIABLES_ELEMENT_ATTRIBUTE, '');
    document.head.appendChild(styleElement);
  }
  if (styleElement.textContent !== cssText) {
    styleElement.textContent = cssText;
  }
}

/**
 * Publishes the theme as `--grafana-*` CSS variables on `<body>` so StyleX styles that use `tokens.stylex.ts`
 * resolve against the active `GrafanaTheme2`. Call once from the root theme provider.
 *
 * Variables are scoped to `body` rather than `body.theme-dark` / `body.theme-light` because the body class is not
 * always in sync with the React theme (for example in Storybook), and portals render inside `body`.
 */
export function useThemeCssVariables(theme: GrafanaTheme2) {
  const cssText = useMemo(() => getThemeCssText(theme), [theme]);

  useInsertionEffect(() => {
    const key = Symbol('theme-variables');
    activeEntries.set(key, cssText);
    render();

    return () => {
      activeEntries.delete(key);
      render();
    };
  }, [cssText]);
}
