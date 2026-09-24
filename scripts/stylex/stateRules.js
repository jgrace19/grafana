'use strict';

// Moves StyleX's state rules out of the `stylex.*` cascade layers.
//
// On `main` a component's Emotion state rules (`&:hover`, `&:disabled`, `&[aria-expanded=true]`, …, 0,2,0) beat a
// consumer's single-class `className` (0,1,0), while the consumer's own state rules won ties by coming later.
// Layered, every StyleX rule loses to any unlayered consumer class, so a consumer's base colour also wins on hover,
// focus and disabled. Unlayered with their own specificity, the state rules rank as they did on `main`:
// - above a consumer's base class, and tied with its state rules (Emotion's later sheet then wins);
// - still above the component's own base rules, which stay layered, so a consumer's className still wins there;
// - absent when a StyleX consumer overrides the property (`xstyle` replaces the whole property), as before.
// StyleX emits its layers in priority order and the moved rules keep that order among themselves.
//
// A state rule is a style rule whose selectors all carry a pseudo-class or attribute condition. `:where(...)`
// conditions (including StyleX's ancestor `when` selectors) stay layered: write a condition as `:where(...)` when
// `main` applied that state with a toggled class, which the consumer's className beat. Pseudo-element-only and
// `:root` rules stay layered too.
//
// Text-level (postcss) on purpose: lightningcss' JS visitor can't round-trip StyleX's `var()` shorthands.

const postcss = require('postcss');
const selectorParser = require('postcss-selector-parser');

const LAYERED_PSEUDO_CLASSES = new Set([':where', ':root']);
// lightningcss prints these pseudo-elements with a single colon.
const LEGACY_PSEUDO_ELEMENTS = new Set([':before', ':after', ':first-line', ':first-letter']);

function isStateSelector(selector) {
  let state = false;
  selector.each((node) => {
    if (node.type === 'attribute') {
      state = true;
    } else if (node.type === 'pseudo') {
      const name = node.value.toLowerCase();
      if (!name.startsWith('::') && !LEGACY_PSEUDO_ELEMENTS.has(name) && !LAYERED_PSEUDO_CLASSES.has(name)) {
        state = true;
      }
    }
  });
  return state;
}

const stateSelectorCache = new Map();
function isStateRule(rule) {
  if (!stateSelectorCache.has(rule.selector)) {
    let result = false;
    try {
      const root = selectorParser().astSync(rule.selector);
      result = root.nodes.length > 0 && root.nodes.every(isStateSelector);
    } catch {
      result = false;
    }
    stateSelectorCache.set(rule.selector, result);
  }
  return stateSelectorCache.get(rule.selector);
}

/** Removes the state rules from `container` (a layer, or a media/supports block inside one) and returns them. */
function extract(container) {
  const moved = [];
  for (const node of [...container.nodes]) {
    if (node.type === 'rule' && isStateRule(node)) {
      moved.push(node.remove());
    } else if (node.type === 'atrule' && (node.name === 'media' || node.name === 'supports') && node.nodes) {
      const inner = extract(node);
      if (inner.length) {
        moved.push(node.clone({ nodes: inner }));
        if (node.nodes.length === 0) {
          node.remove();
        }
      }
    }
  }
  return moved;
}

const isStylexLayer = (node) =>
  node.type === 'atrule' && node.name === 'layer' && /^stylex\./.test(node.params) && node.nodes;

/** Returns `css` with each StyleX layer's state rules placed, in order, right after that layer. */
function unlayerStateRules(css) {
  if (!css.includes('@layer stylex.')) {
    return css;
  }
  const root = postcss.parse(css);
  for (const layer of root.nodes.filter(isStylexLayer)) {
    const moved = extract(layer);
    if (moved.length) {
      layer.after(moved);
      if (layer.nodes.length === 0) {
        layer.remove();
      }
    }
  }
  return root.toString();
}

module.exports = { unlayerStateRules, isStateSelector };
