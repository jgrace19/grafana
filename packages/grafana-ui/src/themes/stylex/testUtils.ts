/**
 * Test helpers for asserting StyleX output in jsdom. jsdom's `getComputedStyle` discards typed values written as
 * `var(...)`, so these read declarations straight from the matching CSSOM rules instead.
 */

/**
 * Last declared value for `property` among stylesheet rules matching `element` (document order), then inline style.
 * Mirrors the browser cascade for equal-specificity class selectors, which is what StyleX and Emotion emit.
 */
export function getCascadedStyle(element: HTMLElement, property: string): string {
  let value = '';
  for (const sheet of Array.from(document.styleSheets)) {
    for (const rule of Array.from(sheet.cssRules)) {
      if (rule instanceof CSSStyleRule && element.matches(rule.selectorText)) {
        value = rule.style.getPropertyValue(property) || value;
      }
    }
  }
  return element.style.getPropertyValue(property) || value;
}

/** Like `getCascadedStyle`, but resolves `var(--name)` against the element's inline style or `<body>` variables. */
export function getResolvedStyle(element: HTMLElement, property: string): string {
  let value = getCascadedStyle(element, property).trim();
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
