// @ts-check
const { ESLintUtils, AST_NODE_TYPES } = require('@typescript-eslint/utils');

const { createStylexTracker, forEachStyleProperty } = require('./stylex-utils.cjs');

/** @typedef {import('@typescript-eslint/utils').TSESTree.Node} Node */

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://github.com/grafana/grafana/blob/main/packages/grafana-eslint-rules/README.md#${name}`
);

const BORDER_RADIUS_PROPERTIES = new Set([
  'borderRadius',
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderBottomLeftRadius',
  'borderBottomRightRadius',
  'borderStartStartRadius',
  'borderStartEndRadius',
  'borderEndStartRadius',
  'borderEndEndRadius',
]);

const RE_ZERO_VALUE = /^0([a-zA-Z%]*)$/;

const rule = createRule({
  create(context) {
    const tracker = createStylexTracker();

    /** @param {Node} value */
    const checkValue = (value) => {
      if (value.type === AST_NODE_TYPES.ObjectExpression) {
        for (const property of value.properties) {
          if (property.type === AST_NODE_TYPES.Property) {
            checkValue(property.value);
          }
        }
        return;
      }
      if (value.type !== AST_NODE_TYPES.Literal || value.value === null) {
        return;
      }
      if (value.value === 'unset' || value.value === 'initial') {
        return;
      }
      if (value.value === 0 || (typeof value.value === 'string' && RE_ZERO_VALUE.test(value.value))) {
        context.report({
          node: value,
          messageId: 'borderRadiusNoZeroValue',
          fix: (fixer) => fixer.replaceText(value, "'unset'"),
        });
        return;
      }
      context.report({ node: value, messageId: 'borderRadiusUseTokens' });
    };

    return {
      ImportDeclaration: tracker.ImportDeclaration,
      CallExpression(node) {
        for (const styleObject of tracker.getNamespaceStyles(node)) {
          forEachStyleProperty(styleObject, (property, name) => {
            if (BORDER_RADIUS_PROPERTIES.has(name)) {
              checkValue(property.value);
            }
          });
        }
      },
    };
  },
  name: 'stylex-no-border-radius-literal',
  meta: {
    type: 'problem',
    fixable: 'code',
    docs: {
      description: 'Check that StyleX border radii use the shape tokens',
    },
    messages: {
      borderRadiusUseTokens: "Prefer the shape tokens (shape['--gf-shape-radius-*']) instead of literal values.",
      borderRadiusNoZeroValue: 'Use unset or initial to remove a border radius.',
    },
    schema: [],
  },
  defaultOptions: [],
});

module.exports = rule;
