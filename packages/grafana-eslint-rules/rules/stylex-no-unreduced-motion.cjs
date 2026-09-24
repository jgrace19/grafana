// @ts-check
const { ESLintUtils, AST_NODE_TYPES } = require('@typescript-eslint/utils');

const { createStylexTracker, forEachStyleProperty } = require('./stylex-utils.cjs');

/** @typedef {import('@typescript-eslint/utils').TSESTree.Node} Node */

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://github.com/grafana/grafana/blob/main/packages/grafana-eslint-rules/README.md#${name}`
);

const restrictedProperties = ['animation', 'transition'];
const excludedProperties = ['transitionProperty'];

const isRestrictedProperty = (/** @type string */ propertyName) =>
  !excludedProperties.includes(propertyName) && restrictedProperties.some((prop) => propertyName.startsWith(prop));

/**
 * A condition key counts as motion-gated when it's a `motion.*` const or a literal media query that
 * mentions prefers-reduced-motion.
 *
 * @param {Node} key
 */
const isMotionConditionKey = (key) => {
  if (
    key.type === AST_NODE_TYPES.MemberExpression &&
    key.object.type === AST_NODE_TYPES.Identifier &&
    key.object.name === 'motion'
  ) {
    return true;
  }
  if (key.type === AST_NODE_TYPES.Literal && typeof key.value === 'string') {
    return key.value.includes('prefers-reduced-motion');
  }
  if (key.type === AST_NODE_TYPES.TemplateLiteral) {
    return key.quasis.some((q) => q.value.raw.includes('prefers-reduced-motion'));
  }
  return false;
};

/**
 * @param {Node} value
 * @returns {boolean}
 */
const isGated = (value) => {
  if (value.type === AST_NODE_TYPES.Literal && (value.value === null || value.value === 'none')) {
    return true;
  }
  if (value.type !== AST_NODE_TYPES.ObjectExpression) {
    return false;
  }
  return value.properties.some(
    (property) =>
      property.type === AST_NODE_TYPES.Property &&
      (isMotionConditionKey(property.key) ||
        (property.value.type === AST_NODE_TYPES.ObjectExpression && isGated(property.value)))
  );
};

const rule = createRule({
  create(context) {
    const tracker = createStylexTracker();
    return {
      ImportDeclaration: tracker.ImportDeclaration,
      CallExpression(node) {
        for (const styleObject of tracker.getNamespaceStyles(node)) {
          forEachStyleProperty(styleObject, (property, name) => {
            if (isRestrictedProperty(name) && !isGated(property.value)) {
              context.report({ node: property, messageId: 'noUnreducedMotion' });
            }
          });
        }
      },
    };
  },
  name: 'stylex-no-unreduced-motion',
  meta: {
    type: 'problem',
    docs: {
      description: 'Check that StyleX animation and transition properties are gated by a reduced-motion condition.',
    },
    messages: {
      noUnreducedMotion:
        'Gate `animation*` / `transition*` properties behind a reduced-motion condition, e.g. `{ default: null, [motion.noPreference]: value }` with `motion` from constants.stylex.',
    },
    schema: [],
  },
  defaultOptions: [],
});

module.exports = rule;
