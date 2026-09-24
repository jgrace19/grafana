/**
 * Test helpers for asserting StyleX output in jsdom. jsdom's `getComputedStyle` discards typed values written as
 * `var(...)`, so these read declarations straight from the matching CSSOM rules instead.
 */
import { type GrafanaTheme2 } from '@grafana/data';

import { useThemeCssVariables } from './useThemeCssVariables';

interface CascadeOptions {
  /** Also apply rules for this state, e.g. `':hover'`, as if the element were in it. */
  pseudoClass?: string;
}

function ruleMatches(element: HTMLElement, selectorText: string, pseudoClass?: string) {
  const selector =
    pseudoClass && selectorText.endsWith(pseudoClass) ? selectorText.slice(0, -pseudoClass.length) : selectorText;
  try {
    return element.matches(selector);
  } catch {
    // jsdom's CSSOM exposes at-rules it doesn't understand (e.g. StyleX's `@property`) as style rules.
    return false;
  }
}

/**
 * Last declared value for `property` among stylesheet rules matching `element` (document order), then inline style.
 * Mirrors the browser cascade for equal-specificity class selectors, which is what StyleX and Emotion emit.
 */
export function getCascadedStyle(element: HTMLElement, property: string, { pseudoClass }: CascadeOptions = {}): string {
  let value = '';
  for (const sheet of Array.from(document.styleSheets)) {
    for (const rule of Array.from(sheet.cssRules)) {
      if (rule instanceof CSSStyleRule && ruleMatches(element, rule.selectorText, pseudoClass)) {
        value = rule.style.getPropertyValue(property) || value;
      }
    }
  }
  return element.style.getPropertyValue(property) || value;
}

/** Like `getCascadedStyle`, but resolves `var(--name)` against the element's inline style or `<body>` variables. */
export function getResolvedStyle(element: HTMLElement, property: string, options?: CascadeOptions): string {
  let value = getCascadedStyle(element, property, options).trim();
  for (let depth = 0; depth < 5; depth++) {
    const match = value.match(/^var\((--[\w-]+)\)$/);
    if (!match) {
      break;
    }
    value = (
      element.style.getPropertyValue(match[1]) || getComputedStyle(document.body).getPropertyValue(match[1])
    ).trim();
  }
  return value;
}

/** Publishes `theme` as `--grafana-*` variables, like the app's ThemeProvider does. */
export const ThemeCssVariables = ({ theme }: { theme: GrafanaTheme2 }) => {
  useThemeCssVariables(theme);
  return null;
};

/** Appends a plain stylesheet after the StyleX sheet, the way Emotion inserts consumer overrides. */
export function appendConsumerStyles(cssText: string): HTMLStyleElement {
  const element = document.createElement('style');
  element.textContent = cssText;
  document.head.appendChild(element);
  return element;
}
