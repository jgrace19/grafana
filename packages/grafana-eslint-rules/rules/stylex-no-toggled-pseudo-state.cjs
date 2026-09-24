// @ts-check
const { ESLintUtils, AST_NODE_TYPES } = require('@typescript-eslint/utils');

/** @typedef {import('@typescript-eslint/utils').TSESTree.Node} Node */

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://github.com/grafana/grafana/blob/main/packages/grafana-eslint-rules/README.md#${name}`
);

const STYLEX_SOURCES = new Set(['@stylexjs/stylex', 'stylex']);

/** State words that CSS can express as a pseudo-class, mapped to that pseudo-class. */
const STATES = {
  disabled: ':disabled',
  hover: ':hover',
  hovered: ':hover',
  hovering: ':hover',
  focus: ':focus / :focus-visible',
  focused: ':focus / :focus-visible',
  focusvisible: ':focus / :focus-visible',
  pressed: ':active',
  checked: ':checked',
  readonly: ':read-only',
};

/**
 * `disabled`, `isDisabled`, `props.disabled`, `styles.disabledState` → `disabled`.
 *
 * @param {string} name
 */
function stateOf(name) {
  const bare = name.replace(/^(is|has)(?=[A-Z])/, '').replace(/(State|Styles?)$/, '');
  const key = bare.toLowerCase();
  return Object.prototype.hasOwnProperty.call(STATES, key) ? key : undefined;
}

/** Intrinsic elements each form-state pseudo-class can match; other intrinsic elements can't take it. */
const FORM_STATE_ELEMENTS = {
  disabled: new Set(['button', 'input', 'select', 'textarea', 'fieldset', 'optgroup', 'option']),
  checked: new Set(['input', 'option']),
  readonly: new Set(['input', 'textarea']),
};

/**
 * The JSX element whose spread or attribute receives this `props()` call, if any.
 *
 * @param {Node} node
 * @returns {string | undefined}
 */
function receivingElement(node) {
  /** @type {Node | undefined} */
  let current = node.parent;
  while (current) {
    if (current.type === AST_NODE_TYPES.JSXOpeningElement) {
      return current.name.type === AST_NODE_TYPES.JSXIdentifier ? current.name.name : 'Component';
    }
    if (
      current.type === AST_NODE_TYPES.VariableDeclarator ||
      current.type === AST_NODE_TYPES.ReturnStatement ||
      current.type === AST_NODE_TYPES.ArrowFunctionExpression ||
      current.type === AST_NODE_TYPES.FunctionDeclaration
    ) {
      return undefined;
    }
    current = current.parent;
  }
  return undefined;
}

/** @param {string} state */
const canonical = (state) => STATES[/** @type {keyof typeof STATES} */ (state)];

/**
 * Names referenced by a condition: identifiers and the last segment of member expressions.
 *
 * @param {Node} node
 * @param {string[]} out
 */
function conditionNames(node, out = []) {
  switch (node.type) {
    case AST_NODE_TYPES.Identifier:
      out.push(node.name);
      break;
    case AST_NODE_TYPES.MemberExpression:
      if (node.property.type === AST_NODE_TYPES.Identifier && !node.computed) {
        out.push(node.property.name);
      }
      break;
    case AST_NODE_TYPES.UnaryExpression:
      conditionNames(node.argument, out);
      break;
    case AST_NODE_TYPES.LogicalExpression:
      conditionNames(node.left, out);
      conditionNames(node.right, out);
      break;
    case AST_NODE_TYPES.ChainExpression:
      conditionNames(node.expression, out);
      break;
    case AST_NODE_TYPES.TSNonNullExpression:
      conditionNames(node.expression, out);
      break;
  }
  return out;
}

/**
 * `styles.disabled` / `styles['disabled']` → `disabled`.
 *
 * @param {Node} node
 */
function namespaceName(node) {
  if (node.type !== AST_NODE_TYPES.MemberExpression) {
    return undefined;
  }
  if (node.property.type === AST_NODE_TYPES.Identifier && !node.computed) {
    return node.property.name;
  }
  if (node.property.type === AST_NODE_TYPES.Literal && typeof node.property.value === 'string') {
    return node.property.value;
  }
  return undefined;
}

const stylexNoToggledPseudoState = createRule({
  create(context) {
    /** @type {Set<string>} */
    const stylexNames = new Set();
    /** @type {Set<string>} */
    const propsNames = new Set();

    /**
     * @param {Node} condition
     * @param {Node} styleRef
     * @param {string | undefined} element
     */
    function check(condition, styleRef, element) {
      const ns = namespaceName(styleRef);
      const nsState = ns && stateOf(ns);
      if (!nsState) {
        return;
      }
      const formElements = FORM_STATE_ELEMENTS[/** @type {keyof typeof FORM_STATE_ELEMENTS} */ (nsState)];
      if (formElements && element && /^[a-z]/.test(element) && !formElements.has(element)) {
        return;
      }
      const matches = conditionNames(condition).some((name) => {
        const s = stateOf(name);
        return s !== undefined && canonical(s) === canonical(nsState);
      });
      if (matches) {
        context.report({
          node: styleRef,
          messageId: 'toggledPseudoState',
          data: { namespace: String(ns), pseudo: canonical(nsState) },
        });
      }
    }

    /**
     * @param {Node} arg
     * @param {string | undefined} element
     */
    function visitArg(arg, element) {
      if (arg.type === AST_NODE_TYPES.LogicalExpression && arg.operator === '&&') {
        check(arg.left, arg.right, element);
      } else if (arg.type === AST_NODE_TYPES.ConditionalExpression) {
        check(arg.test, arg.consequent, element);
        visitArg(arg.alternate, element);
      } else if (arg.type === AST_NODE_TYPES.ArrayExpression) {
        for (const el of arg.elements) {
          if (el && el.type !== AST_NODE_TYPES.SpreadElement) {
            visitArg(el, element);
          }
        }
      }
    }

    return {
      ImportDeclaration(node) {
        if (!STYLEX_SOURCES.has(String(node.source.value))) {
          return;
        }
        for (const specifier of node.specifiers) {
          if (
            specifier.type === AST_NODE_TYPES.ImportNamespaceSpecifier ||
            specifier.type === AST_NODE_TYPES.ImportDefaultSpecifier
          ) {
            stylexNames.add(specifier.local.name);
          } else if (
            specifier.type === AST_NODE_TYPES.ImportSpecifier &&
            specifier.imported.type === AST_NODE_TYPES.Identifier &&
            specifier.imported.name === 'props'
          ) {
            propsNames.add(specifier.local.name);
          }
        }
      },
      CallExpression(node) {
        const { callee } = node;
        const isProps =
          (callee.type === AST_NODE_TYPES.MemberExpression &&
            callee.object.type === AST_NODE_TYPES.Identifier &&
            stylexNames.has(callee.object.name) &&
            callee.property.type === AST_NODE_TYPES.Identifier &&
            callee.property.name === 'props') ||
          (callee.type === AST_NODE_TYPES.Identifier && propsNames.has(callee.name));
        if (!isProps) {
          return;
        }
        const element = receivingElement(node);
        for (const arg of node.arguments) {
          if (arg.type !== AST_NODE_TYPES.SpreadElement) {
            visitArg(arg, element);
          }
        }
      },
    };
  },
  name: 'stylex-no-toggled-pseudo-state',
  meta: {
    type: 'problem',
    docs: {
      description:
        'Flag StyleX namespaces toggled from JS for states CSS expresses as pseudo-classes. A toggled namespace applies base (layered) rules, which lose to a consumer className; a pseudo-class condition is kept out of the layers and beats it, as on main.',
    },
    messages: {
      toggledPseudoState:
        "'{{namespace}}' is toggled from JS for a state CSS can express as {{pseudo}}. If the Emotion original used the pseudo-class, keep it a StyleX condition (`{ default: null, '{{pseudo}}': value }`) so it still beats a consumer className. If the original toggled a class too, disable this line with that reason.",
    },
    schema: [],
  },
  defaultOptions: [],
});

module.exports = stylexNoToggledPseudoState;
