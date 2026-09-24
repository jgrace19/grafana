// @ts-check
const { AST_NODE_TYPES } = require('@typescript-eslint/utils');

/** @typedef {import('@typescript-eslint/utils').TSESTree.Node} Node */
/** @typedef {import('@typescript-eslint/utils').TSESTree.ObjectExpression} ObjectExpression */
/** @typedef {import('@typescript-eslint/utils').TSESTree.Property} Property */

const STYLEX_SOURCES = new Set(['@stylexjs/stylex', 'stylex']);

/**
 * Tracks how `stylex.create` is referenced in a file (`import * as stylex`, `import stylex`, or
 * `import { create }`) and returns the style-namespace objects passed to it.
 */
function createStylexTracker() {
  /** @type {Set<string>} */
  const namespaces = new Set();
  /** @type {Set<string>} */
  const createNames = new Set();

  return {
    /** @param {import('@typescript-eslint/utils').TSESTree.ImportDeclaration} node */
    ImportDeclaration(node) {
      if (!STYLEX_SOURCES.has(String(node.source.value))) {
        return;
      }
      for (const specifier of node.specifiers) {
        if (
          specifier.type === AST_NODE_TYPES.ImportNamespaceSpecifier ||
          specifier.type === AST_NODE_TYPES.ImportDefaultSpecifier
        ) {
          namespaces.add(specifier.local.name);
        } else if (
          specifier.type === AST_NODE_TYPES.ImportSpecifier &&
          specifier.imported.type === AST_NODE_TYPES.Identifier &&
          specifier.imported.name === 'create'
        ) {
          createNames.add(specifier.local.name);
        }
      }
    },

    /**
     * @param {import('@typescript-eslint/utils').TSESTree.CallExpression} node
     * @returns {ObjectExpression[]} the style objects of each namespace (dynamic styles included)
     */
    getNamespaceStyles(node) {
      const { callee } = node;
      const isCreate =
        (callee.type === AST_NODE_TYPES.MemberExpression &&
          callee.object.type === AST_NODE_TYPES.Identifier &&
          namespaces.has(callee.object.name) &&
          callee.property.type === AST_NODE_TYPES.Identifier &&
          callee.property.name === 'create') ||
        (callee.type === AST_NODE_TYPES.Identifier && createNames.has(callee.name));
      const arg = node.arguments[0];
      if (!isCreate || !arg || arg.type !== AST_NODE_TYPES.ObjectExpression) {
        return [];
      }
      /** @type {ObjectExpression[]} */
      const result = [];
      for (const namespace of arg.properties) {
        if (namespace.type !== AST_NODE_TYPES.Property) {
          continue;
        }
        const value = namespace.value;
        if (value.type === AST_NODE_TYPES.ObjectExpression) {
          result.push(value);
        } else if (
          value.type === AST_NODE_TYPES.ArrowFunctionExpression &&
          value.body.type === AST_NODE_TYPES.ObjectExpression
        ) {
          result.push(value.body);
        }
      }
      return result;
    },
  };
}

/**
 * @param {Property} property
 * @returns {string | undefined}
 */
function getKeyName(property) {
  if (property.key.type === AST_NODE_TYPES.Identifier && !property.computed) {
    return property.key.name;
  }
  if (property.key.type === AST_NODE_TYPES.Literal && typeof property.key.value === 'string') {
    return property.key.value;
  }
  return undefined;
}

/**
 * Calls `visit` for each CSS property of a namespace style object, descending into pseudo-element blocks.
 *
 * @param {ObjectExpression} styleObject
 * @param {(property: Property, name: string) => void} visit
 */
function forEachStyleProperty(styleObject, visit) {
  for (const property of styleObject.properties) {
    if (property.type !== AST_NODE_TYPES.Property) {
      continue;
    }
    const name = getKeyName(property);
    if (name === undefined) {
      continue;
    }
    if (name.startsWith('::') && property.value.type === AST_NODE_TYPES.ObjectExpression) {
      forEachStyleProperty(property.value, visit);
      continue;
    }
    visit(property, name);
  }
}

module.exports = { createStylexTracker, forEachStyleProperty, getKeyName };
