// @ts-check
const { ESLintUtils, AST_NODE_TYPES } = require('@typescript-eslint/utils');

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://github.com/grafana/grafana/blob/main/packages/grafana-eslint-rules/README.md#${name}`
);

/**
 * StyleX counterpart of theme-token-usage: reports every `group['--gf-…']` read of a token group imported
 * from a tokens.stylex module, so token usage can be counted. Not meant to be enabled as a lint rule.
 */
const rule = createRule({
  create(context) {
    /** @type {Set<string>} */
    const tokenGroups = new Set();
    return {
      ImportDeclaration(node) {
        if (!/tokens\.stylex(\.ts)?$/.test(String(node.source.value))) {
          return;
        }
        for (const specifier of node.specifiers) {
          if (specifier.type === AST_NODE_TYPES.ImportSpecifier) {
            tokenGroups.add(specifier.local.name);
          }
        }
      },
      MemberExpression(node) {
        if (
          node.computed &&
          node.object.type === AST_NODE_TYPES.Identifier &&
          tokenGroups.has(node.object.name) &&
          node.property.type === AST_NODE_TYPES.Literal &&
          typeof node.property.value === 'string'
        ) {
          context.report({
            node,
            messageId: 'themeTokenUsed',
            data: { identifier: `${node.object.name}['${node.property.value}']` },
          });
        }
      },
    };
  },
  name: 'stylex-theme-token-usage',
  meta: {
    type: 'problem',
    docs: {
      description: 'Check for StyleX theme token usage',
    },
    messages: {
      themeTokenUsed: '{{ identifier }}',
    },
    schema: [],
  },
  defaultOptions: [],
});

module.exports = rule;
