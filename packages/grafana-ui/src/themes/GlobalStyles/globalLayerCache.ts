import createCache, { type StylisElement, type StylisPlugin } from '@emotion/cache';

const UNWRAPPED_TYPES = new Set(['decl', 'comm', '@import', '@charset', '@layer']);

/**
 * Wraps every top-level rule in its own `@layer grafana-global { … }` block. One block per rule keeps
 * Emotion's one-insert-per-rule behaviour: a rule the browser can't parse only drops itself. A single block
 * around all global styles gets truncated at the first such rule (forms.ts has `content: '"\f0d7"'`, where
 * `\f` is a form feed that leaves an unterminated CSS string).
 */
export const wrapInGlobalLayer: StylisPlugin = (element) => {
  if (element.root !== null || UNWRAPPED_TYPES.has(element.type)) {
    return;
  }
  const rule: StylisElement = { ...element, root: element, parent: element };
  element.type = '@layer';
  element.value = '@layer grafana-global';
  element.props = ['grafana-global'];
  element.children = [rule];
};

/** Emotion cache for GlobalStyles: same insertion as the default cache, with every rule layered. */
export const globalLayerCache = createCache({ key: 'css-layered', stylisPlugins: [wrapInGlobalLayer] });
