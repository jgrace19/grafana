/**
 * Runtime injector for StyleX rules, wired in via the babel plugin's `runtimeInjection` option
 * (see scripts/stylex/transform.js).
 *
 * The stock `@stylexjs/stylex/lib/stylex-inject` raises specificity with one `:not(#\#)` per priority level, which
 * would make StyleX rules beat any Emotion class a consumer passes through `className`. This injector keeps plain
 * class specificity and instead orders rules by priority inside one sheet placed first in <head>. Emotion appends
 * its sheets after it, so `className` overrides keep working while components are converted incrementally.
 */

interface InjectArgs {
  readonly ltr: string;
  readonly rtl?: string | null;
  readonly priority: number;
  readonly constKey?: string;
  readonly constVal?: string | number;
}

export const STYLEX_STYLE_ELEMENT_ATTRIBUTE = 'data-grafana-stylex';

const insertedRules = new Set<string>();
const ruleCountByPriority = new Map<number, number>();
const constants = new Map<string, string>();
let sheet: CSSStyleSheet | null = null;

function getSheet(): CSSStyleSheet | null {
  if (sheet || typeof document === 'undefined' || !document.head) {
    return sheet;
  }

  const element = document.createElement('style');
  element.setAttribute(STYLEX_STYLE_ELEMENT_ATTRIBUTE, '');
  document.head.insertBefore(element, document.head.firstChild);
  sheet = element.sheet;
  return sheet;
}

function getInsertionIndex(priority: number): number {
  let index = 0;
  for (const [groupPriority, count] of ruleCountByPriority) {
    if (groupPriority <= priority) {
      index += count;
    }
  }
  return index;
}

function resolveConstants(cssText: string): string {
  if (constants.size === 0) {
    return cssText;
  }
  return cssText.replace(/var\(--([a-z0-9]+)\)/gi, (match, key: string) => constants.get(key) ?? match);
}

export default function inject({ ltr, priority, constKey, constVal }: InjectArgs): string {
  if (constKey !== undefined && constVal !== undefined) {
    constants.set(constKey, String(constVal));
    return '';
  }

  const cssText = resolveConstants(ltr);
  if (!cssText || insertedRules.has(cssText)) {
    return cssText;
  }

  const target = getSheet();
  if (!target) {
    return cssText;
  }

  try {
    target.insertRule(cssText, getInsertionIndex(priority));
  } catch {
    // Rules the engine cannot parse (e.g. `@property` in older engines) are skipped, as the stock injector does.
    return cssText;
  }

  insertedRules.add(cssText);
  ruleCountByPriority.set(priority, (ruleCountByPriority.get(priority) ?? 0) + 1);
  return cssText;
}
