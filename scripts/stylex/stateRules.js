'use strict';

// Moves StyleX's state rules out of the `stylex.*` cascade layers.
//
// On `main` a component's Emotion state rules (`&:hover`, `&:disabled`, `&[aria-expanded=true]`, …, 0,2,0) beat a
// consumer's single-class `className` (0,1,0), while the consumer's own state rules won ties by coming later.
// Layered, every StyleX rule loses to any unlayered consumer class, so a consumer's base colour also wins on hover,
// focus and disabled. Unlayered with their own specificity, the state rules rank as they did on `main`:
// - above a consumer's base class, below or tied with (and then after, in Emotion's later sheet) its state rules;
// - still above the component's own base rules, which stay layered, so a consumer's className still wins there;
// - absent when a StyleX consumer overrides the property (`xstyle` replaces the whole property), as before.
// StyleX emits its layers in priority order and the moved rules keep that order among themselves.
//
// A state rule is a style rule whose selectors all carry a pseudo-class or attribute condition. `:where(...)`
// conditions (including StyleX's ancestor `when` selectors) stay layered: write a condition as `:where(...)` when
// `main` applied that state with a toggled class, which the consumer's className beat. Pseudo-element-only and
// `:root` rules stay layered too.

const LAYERED_PSEUDO_CLASSES = new Set(['where', 'root']);

function isStateSelector(selector) {
  return selector.some(
    (component) =>
      component.type === 'attribute' ||
      (component.type === 'pseudo-class' && !LAYERED_PSEUDO_CLASSES.has(component.kind))
  );
}

function isStateRule(rule) {
  return rule.type === 'style' && rule.value.selectors.length > 0 && rule.value.selectors.every(isStateSelector);
}

/** Splits a layer's rules (media/supports blocks included) into the ones that stay and the state rules. */
function partition(rules) {
  const kept = [];
  const moved = [];
  for (const rule of rules) {
    if (isStateRule(rule)) {
      moved.push(rule);
    } else if ((rule.type === 'media' || rule.type === 'supports') && Array.isArray(rule.value.rules)) {
      const inner = partition(rule.value.rules);
      if (inner.kept.length) {
        kept.push({ ...rule, value: { ...rule.value, rules: inner.kept } });
      }
      if (inner.moved.length) {
        moved.push({ ...rule, value: { ...rule.value, rules: inner.moved } });
      }
    } else {
      kept.push(rule);
    }
  }
  return { kept, moved };
}

const isStylexLayer = (rule) => Array.isArray(rule.value.name) && rule.value.name[0] === 'stylex';

/** lightningcss visitor; pass as `visitor` in the StyleX unplugin's `lightningcssOptions`. */
const stateRulesVisitor = {
  Rule: {
    'layer-block'(rule) {
      if (!isStylexLayer(rule)) {
        return undefined;
      }
      const { kept, moved } = partition(rule.value.rules);
      if (moved.length === 0) {
        return undefined;
      }
      return [...(kept.length ? [{ ...rule, value: { ...rule.value, rules: kept } }] : []), ...moved];
    },
  },
};

/** For CSS that doesn't go through the unplugin's lightningcss pass (rollup's `dist/stylex.css`). */
function unlayerStateRules(css) {
  // The unplugin's own lightningcss, so both paths run the same version.
  const { transform } = require(require.resolve('lightningcss', { paths: [require.resolve('@stylexjs/unplugin')] }));
  return transform({ filename: 'stylex.css', code: Buffer.from(css), visitor: stateRulesVisitor }).code.toString();
}

module.exports = { stateRulesVisitor, isStateSelector, unlayerStateRules };
