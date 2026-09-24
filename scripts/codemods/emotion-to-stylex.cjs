/**
 * First-pass Emotion → StyleX codemod for the StyleX migration (see the StyleX conventions doc).
 *
 *   npx jscodeshift -t scripts/codemods/emotion-to-stylex.cjs --parser=tsx <files>
 *
 * Handles the mechanical cases:
 *   - `const getStyles = (theme: GrafanaTheme2) => ({ key: css({...}) })` → `const styles = stylex.create({...})`
 *   - theme references → generated tokens/consts (`theme.colors.text.primary` → `colors['--gf-colors-text-primary']`)
 *   - `theme.spacing(...)`, multi-value padding/margin/border shorthands → physical longhands
 *   - `'&:hover'`-style pseudo blocks, breakpoint and reduced-motion media blocks → per-property conditions
 *   - `useStyles2(getStyles)` removal, `className={styles.x}` / `cx(...)` → `stylex.props` / `mergeStylexProps`
 *
 * Anything it can't translate faithfully (descendant selectors, dynamic values, prop-driven getStyles, color
 * math) is left in place with a `TODO(stylex)` comment for the migrator. It never guesses: a file whose
 * getStyles it can't fully convert is only annotated.
 */
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '../..');
const tokensDir = path.join(repoRoot, 'packages/grafana-ui/src/themes/stylex');

const TODO = 'TODO(stylex)';

let tokenIndex;
function loadTokens() {
  if (tokenIndex) {
    return tokenIndex;
  }
  const byName = new Map();
  const source = fs.readFileSync(path.join(tokensDir, 'tokens.stylex.ts'), 'utf8');
  let group = null;
  for (const line of source.split('\n')) {
    const groupMatch = /^export const (\w+) = stylex\.defineVars/.exec(line);
    if (groupMatch) {
      group = groupMatch[1];
      continue;
    }
    const varMatch = /^\s+'(--gf-[\w-]+)':/.exec(line);
    if (group && varMatch) {
      byName.set(varMatch[1], group);
    }
  }
  const consts = new Map();
  const constSource = fs.readFileSync(path.join(tokensDir, 'constants.stylex.ts'), 'utf8');
  let constGroup = null;
  for (const line of constSource.split('\n')) {
    const groupMatch = /^export const (\w+) = stylex\.defineConsts/.exec(line);
    if (groupMatch) {
      constGroup = groupMatch[1];
      consts.set(constGroup, new Set());
      continue;
    }
    const keyMatch = /^\s+(\w+):/.exec(line);
    if (constGroup && keyMatch) {
      consts.get(constGroup).add(keyMatch[1]);
    }
  }
  tokenIndex = { byName, consts };
  return tokenIndex;
}

const kebab = (s) =>
  s
    .replace(/_/g, '-')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();

const SHORTHAND_SIDES = {
  padding: ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'],
  margin: ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'],
};

const MOTION_KEYS = {
  'no-preference': 'noPreference',
  reduce: 'reduce',
  'no-preference,reduce': 'noPreferenceOrReduce',
};

const TRANSITION_CONSTS = { duration: 'durations', easing: 'easings' };

module.exports = function transform(fileInfo, api) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);
  const { byName, consts } = loadTokens();

  const usedGroups = new Set();
  const usedConsts = new Set();
  const todos = [];

  const emotionImport = root.find(j.ImportDeclaration, { source: { value: '@emotion/css' } });
  if (emotionImport.size() === 0) {
    return null;
  }

  // ---------------------------------------------------------------------------------------------------
  // Values

  /** `theme.a.b.c` → ['a','b','c'] or null */
  const themePath = (node) => {
    const parts = [];
    let current = node;
    while (current.type === 'MemberExpression' && !current.computed && current.property.type === 'Identifier') {
      parts.unshift(current.property.name);
      current = current.object;
    }
    return current.type === 'Identifier' && current.name === 'theme' && parts.length > 0 ? parts : null;
  };

  const tokenRef = (parts) => {
    const name = `--gf-${parts.map(kebab).join('-')}`;
    const group = byName.get(name);
    if (!group) {
      return null;
    }
    usedGroups.add(group);
    return j.memberExpression(j.identifier(group), j.stringLiteral(name), true);
  };

  const constRef = (group, key) => {
    if (!consts.has(group) || !consts.get(group).has(key)) {
      return null;
    }
    usedConsts.add(group);
    return j.memberExpression(j.identifier(group), j.identifier(key));
  };

  const spacingOf = (arg) => {
    if (arg.type === 'StringLiteral' || (arg.type === 'Literal' && typeof arg.value === 'string')) {
      return { text: arg.value };
    }
    const numeric =
      arg.type === 'NumericLiteral' || (arg.type === 'Literal' && typeof arg.value === 'number')
        ? arg.value
        : arg.type === 'UnaryExpression' && arg.operator === '-' && typeof arg.argument.value === 'number'
          ? -arg.argument.value
          : null;
    if (numeric === null) {
      return null;
    }
    const token = tokenRef(['spacing', `x${String(numeric).replace('.', '_')}`]);
    if (token && numeric >= 0) {
      return { node: token };
    }
    usedGroups.add('spacing');
    return { template: `calc(\${spacing['--gf-spacing-grid-size']} * ${numeric})` };
  };

  const spacingNode = (part) => {
    if (part.node) {
      return part.node;
    }
    if (part.text !== undefined) {
      return j.stringLiteral(part.text);
    }
    return templateFrom(part.template);
  };

  const templateFrom = (template) => {
    // Only used for the fixed calc() shape above.
    const [before, after] = template.split("${spacing['--gf-spacing-grid-size']}");
    return j.templateLiteral(
      [
        j.templateElement({ raw: before, cooked: before }, false),
        j.templateElement({ raw: after, cooked: after }, true),
      ],
      [j.memberExpression(j.identifier('spacing'), j.stringLiteral('--gf-spacing-grid-size'), true)]
    );
  };

  /** Returns the StyleX value node, or null when the value can't be expressed statically. */
  const convertValue = (node) => {
    switch (node.type) {
      case 'StringLiteral':
      case 'NumericLiteral':
      case 'NullLiteral':
      case 'Literal':
        return node;
      case 'MemberExpression': {
        const parts = themePath(node);
        if (!parts) {
          return null;
        }
        if (parts[0] === 'zIndex' && parts.length === 2) {
          return constRef('zIndex', parts[1]);
        }
        if (parts[0] === 'transitions' && TRANSITION_CONSTS[parts[1]] && parts.length === 3) {
          return constRef(TRANSITION_CONSTS[parts[1]], parts[2]);
        }
        return tokenRef(parts);
      }
      case 'CallExpression': {
        const callee = node.callee.type === 'MemberExpression' ? themePath(node.callee) : null;
        if (callee && callee.length === 1 && callee[0] === 'spacing') {
          const parts = node.arguments.map(spacingOf);
          if (parts.some((p) => p === null)) {
            return null;
          }
          if (parts.length <= 1) {
            return parts.length === 0 ? tokenRef(['spacing', 'x1']) : spacingNode(parts[0]);
          }
          return joinWithSpaces(parts.map(spacingNode));
        }
        return null;
      }
      case 'TemplateLiteral': {
        const expressions = node.expressions.map(convertValue);
        if (expressions.some((e) => e === null)) {
          return null;
        }
        return j.templateLiteral(node.quasis, expressions);
      }
      default:
        return null;
    }
  };

  const joinWithSpaces = (nodes) => {
    const quasis = [j.templateElement({ raw: '', cooked: '' }, false)];
    nodes.forEach((_, i) => {
      const text = i === nodes.length - 1 ? '' : ' ';
      quasis.push(j.templateElement({ raw: text, cooked: text }, i === nodes.length - 1));
    });
    return j.templateLiteral(quasis, nodes);
  };

  /** Splits a converted shorthand value into its space-separated parts, when that's statically possible. */
  const splitValue = (original) => {
    if (original.type === 'CallExpression') {
      const callee = original.callee.type === 'MemberExpression' ? themePath(original.callee) : null;
      if (callee && callee[0] === 'spacing') {
        const parts = original.arguments.map(spacingOf);
        return parts.some((p) => p === null) ? null : parts.map(spacingNode);
      }
    }
    if (original.type === 'StringLiteral' || (original.type === 'Literal' && typeof original.value === 'string')) {
      return original.value
        .trim()
        .split(/\s+/)
        .map((part) => j.stringLiteral(part));
    }
    return null;
  };

  const expandFourSides = (values) => {
    const [top, right = top, bottom = top, left = right] = values;
    return [top, right, bottom, left];
  };

  // ---------------------------------------------------------------------------------------------------
  // Style objects

  const keyName = (prop) => {
    if (prop.computed) {
      return null;
    }
    if (prop.key.type === 'Identifier') {
      return prop.key.name;
    }
    if (prop.key.type === 'StringLiteral' || prop.key.type === 'Literal') {
      return String(prop.key.value);
    }
    return null;
  };

  /** Maps a nested block key to a StyleX condition key node, or null when it needs restructuring. */
  const conditionKey = (prop) => {
    if (prop.computed) {
      const key = prop.key;
      if (key.type === 'CallExpression' && key.callee.type === 'MemberExpression') {
        const callee = themePath(key.callee);
        const args = key.arguments.map((a) => a.value);
        if (callee && callee.join('.') === 'breakpoints.up' && args.length === 1) {
          const ref = constRef('bp', `${args[0]}Up`);
          return ref ? [ref] : null;
        }
        if (callee && callee.join('.') === 'breakpoints.down' && args.length === 1) {
          const ref = constRef('bp', `${args[0]}Down`);
          return ref ? [ref] : null;
        }
        if (callee && callee.join('.') === 'transitions.handleMotion') {
          const ref = constRef('motion', MOTION_KEYS[args.join(',')]);
          return ref ? [ref] : null;
        }
      }
      return null;
    }
    const name = keyName(prop);
    if (name === null) {
      return null;
    }
    if (name.startsWith('@media') || name.startsWith('@container') || name.startsWith('@supports')) {
      return [j.stringLiteral(name)];
    }
    // '&:hover', ':hover', '&:hover, &:focus'
    const selectors = name.split(',').map((s) => s.trim());
    const pseudos = selectors.map((s) => /^&?(:{1}[a-z-]+(\([^)]*\))?)$/.exec(s));
    if (pseudos.every(Boolean)) {
      return pseudos.map((m) => j.stringLiteral(m[1]));
    }
    return null;
  };

  const isPseudoElementKey = (name) => name !== null && /^&?::[a-z-]+$/.test(name);

  /**
   * Converts one `css({...})` object into StyleX property entries.
   * Returns { properties, unresolved } where unresolved lists source snippets that need manual work.
   */
  const convertStyleObject = (obj) => {
    const props = new Map(); // cssProp -> { base, conditions: [[keyNode, valueNode]] }
    const order = [];
    const pseudoElements = [];
    const unresolved = [];

    const setProp = (name, value, condition) => {
      if (!props.has(name)) {
        props.set(name, { base: undefined, conditions: [] });
        order.push(name);
      }
      const entry = props.get(name);
      if (condition) {
        entry.conditions.push([condition, value]);
      } else {
        entry.base = value;
      }
    };

    const addDeclaration = (name, valueNode, condition) => {
      if (name === 'label') {
        return;
      }
      const converted = convertValue(valueNode);
      if (!converted) {
        unresolved.push(`${name}: ${j(valueNode).toSource()} (not static)`);
        return;
      }
      if (SHORTHAND_SIDES[name]) {
        const parts = splitValue(valueNode);
        if (parts && parts.length > 1) {
          expandFourSides(parts).forEach((part, i) => setProp(SHORTHAND_SIDES[name][i], part, condition));
          return;
        }
      }
      if (
        name === 'border' ||
        name === 'borderTop' ||
        name === 'borderBottom' ||
        name === 'borderLeft' ||
        name === 'borderRight'
      ) {
        unresolved.push(`${name}: ${j(valueNode).toSource()} (split into ${name}Width/Style/Color)`);
        return;
      }
      if (name === 'background' && converted.type === 'MemberExpression') {
        setProp('backgroundColor', converted, condition);
        return;
      }
      setProp(name, converted, condition);
    };

    for (const prop of obj.properties) {
      if (prop.type === 'SpreadElement') {
        unresolved.push(`...${j(prop.argument).toSource()} (spread)`);
        continue;
      }
      const name = keyName(prop);
      if (prop.value.type !== 'ObjectExpression') {
        if (name === null) {
          unresolved.push(`${j(prop).toSource()} (computed key)`);
        } else {
          addDeclaration(name, prop.value, null);
        }
        continue;
      }
      if (isPseudoElementKey(name)) {
        const inner = convertStyleObject(prop.value);
        unresolved.push(...inner.unresolved.map((u) => `${name} › ${u}`));
        pseudoElements.push(
          j.objectProperty(j.stringLiteral(name.replace(/^&/, '')), j.objectExpression(inner.properties))
        );
        continue;
      }
      const conditions = conditionKey(prop);
      if (!conditions) {
        unresolved.push(`${prop.computed ? `[${j(prop.key).toSource()}]` : `'${name}'`}: {…} (restructure: selector)`);
        continue;
      }
      for (const inner of prop.value.properties) {
        const innerName = inner.type === 'SpreadElement' ? null : keyName(inner);
        if (innerName === null || inner.value.type === 'ObjectExpression') {
          unresolved.push(`${j(inner).toSource().split('\n')[0]} (nested inside a condition)`);
          continue;
        }
        conditions.forEach((condition) => addDeclaration(innerName, inner.value, condition));
      }
    }

    const properties = order.map((name) => {
      const { base, conditions } = props.get(name);
      const value =
        conditions.length === 0
          ? base
          : j.objectExpression([
              j.objectProperty(j.identifier('default'), base ?? j.nullLiteral()),
              ...conditions.map(([key, v]) => {
                const property = j.objectProperty(key, v);
                property.computed = key.type !== 'StringLiteral';
                return property;
              }),
            ]);
      return j.objectProperty(j.identifier(name), value);
    });
    return { properties: [...properties, ...pseudoElements], unresolved };
  };

  // ---------------------------------------------------------------------------------------------------
  // getStyles → stylex.create

  const returnedObject = (fn) => {
    if (fn.body.type === 'ObjectExpression') {
      return fn.body;
    }
    if (fn.body.type === 'BlockStatement' && fn.body.body.length === 1 && fn.body.body[0].type === 'ReturnStatement') {
      const arg = fn.body.body[0].argument;
      return arg && arg.type === 'ObjectExpression' ? arg : null;
    }
    return null;
  };

  const isThemeOnly = (fn) =>
    fn.params.length === 1 && fn.params[0].type === 'Identifier' && fn.params[0].name === 'theme';

  const converted = new Set();

  root.find(j.VariableDeclarator).forEach((declPath) => {
    const decl = declPath.node;
    if (decl.id.type !== 'Identifier' || !/^get\w*Styles$/.test(decl.id.name)) {
      return;
    }
    const fn = decl.init;
    if (!fn || (fn.type !== 'ArrowFunctionExpression' && fn.type !== 'FunctionExpression')) {
      return;
    }
    const statement = declPath.parent;
    if (statement.parent && statement.parent.node.type === 'ExportNamedDeclaration') {
      todos.push(`${decl.id.name}: exported style factory; other modules consume it, migrate them together`);
      return;
    }
    const obj = returnedObject(fn);
    if (!obj || !isThemeOnly(fn)) {
      todos.push(
        `${decl.id.name}: prop-driven or non-literal style factory; convert to variant namespaces or dynamic styles by hand`
      );
      return;
    }
    const namespaces = [];
    const unresolved = [];
    for (const prop of obj.properties) {
      const key = prop.type === 'SpreadElement' ? null : keyName(prop);
      const call = prop.value;
      const isCss =
        call &&
        call.type === 'CallExpression' &&
        call.callee.type === 'Identifier' &&
        call.callee.name === 'css' &&
        call.arguments.length === 1 &&
        call.arguments[0].type === 'ObjectExpression';
      if (key === null || !isCss) {
        unresolved.push(`${key ?? '…'}: not a single css({...}) object`);
        continue;
      }
      const result = convertStyleObject(call.arguments[0]);
      unresolved.push(...result.unresolved.map((u) => `${key} › ${u}`));
      namespaces.push(j.objectProperty(j.identifier(key), j.objectExpression(result.properties)));
    }
    if (unresolved.some((u) => u.includes('not a single css'))) {
      todos.push(`${decl.id.name}: ${unresolved.join('; ')}`);
      return;
    }
    const create = j.variableDeclaration('const', [
      j.variableDeclarator(
        j.identifier('styles'),
        j.callExpression(j.memberExpression(j.identifier('stylex'), j.identifier('create')), [
          j.objectExpression(namespaces),
        ])
      ),
    ]);
    if (unresolved.length > 0) {
      create.comments = [
        j.commentLine(` ${TODO}: restructure by hand (see conventions §3.7):`),
        ...unresolved.map((u) => j.commentLine(`   - ${u}`)),
      ];
    }
    j(statement).replaceWith(create);
    converted.add(decl.id.name);
  });

  if (converted.size === 0) {
    return todos.length > 0 ? annotate() : null;
  }

  // ---------------------------------------------------------------------------------------------------
  // Component side

  root
    .find(j.VariableDeclarator, { init: { type: 'CallExpression', callee: { name: 'useStyles2' } } })
    .filter((p) => p.node.init.arguments.length === 1 && converted.has(p.node.init.arguments[0].name))
    .forEach((p) => {
      if (p.node.id.type === 'Identifier' && p.node.id.name === 'styles') {
        j(p.parent).remove();
      } else {
        todos.push(`useStyles2 result is not named 'styles'`);
      }
    });

  const isStylesRef = (node) =>
    node && node.type === 'MemberExpression' && node.object.type === 'Identifier' && node.object.name === 'styles';

  let needsMerge = false;

  /** Splits cx() args into StyleX args and consumer class-name args. */
  const splitCxArgs = (args) => {
    const sx = [];
    const other = [];
    for (const arg of args) {
      if (isStylesRef(arg)) {
        sx.push(arg);
      } else if (arg.type === 'LogicalExpression' && arg.operator === '&&' && isStylesRef(arg.right)) {
        sx.push(arg);
      } else if (arg.type === 'ObjectExpression' && arg.properties.every((p) => p.computed && isStylesRef(p.key))) {
        arg.properties.forEach((p) => sx.push(j.logicalExpression('&&', p.value, p.key)));
      } else {
        other.push(arg);
      }
    }
    return { sx, other };
  };

  const stylexProps = (args) =>
    j.callExpression(j.memberExpression(j.identifier('stylex'), j.identifier('props')), args);

  root.find(j.JSXAttribute, { name: { name: 'className' } }).forEach((attrPath) => {
    const container = attrPath.node.value;
    if (!container || container.type !== 'JSXExpressionContainer') {
      return;
    }
    const expr = container.expression;
    const element = attrPath.parent.node;
    const isDom = element.name && element.name.type === 'JSXIdentifier' && /^[a-z]/.test(element.name.name);
    let replacement = null;

    if (isStylesRef(expr)) {
      replacement = stylexProps([expr]);
    } else if (expr.type === 'CallExpression' && expr.callee.type === 'Identifier' && expr.callee.name === 'cx') {
      const { sx, other } = splitCxArgs(expr.arguments);
      if (sx.length === 0) {
        return;
      }
      if (other.length === 0) {
        replacement = stylexProps(sx);
      } else {
        needsMerge = true;
        const className = other.length === 1 ? other[0] : j.callExpression(j.identifier('cx'), other);
        replacement = j.callExpression(j.identifier('mergeStylexProps'), [
          stylexProps(sx),
          j.objectExpression([j.objectProperty(j.identifier('className'), className)]),
        ]);
      }
    }
    if (!replacement) {
      return;
    }
    if (isDom) {
      j(attrPath).replaceWith(j.jsxSpreadAttribute(replacement));
    } else {
      attrPath.node.value = j.jsxExpressionContainer(j.memberExpression(replacement, j.identifier('className')));
    }
  });

  root.find(j.MemberExpression, { object: { name: 'styles' } }).forEach((p) => {
    const parent = p.parent.node;
    const inStylexCall =
      parent.type === 'CallExpression' ||
      parent.type === 'LogicalExpression' ||
      (parent.type === 'ObjectProperty' && parent.key === p.node);
    if (
      !inStylexCall &&
      !j(p)
        .closest(j.VariableDeclarator, { id: { name: 'styles' } })
        .size()
    ) {
      todos.push(
        `styles.${p.node.property.name ?? '…'} used outside className; use stylex.props(styles.x).className or xstyle`
      );
    }
  });

  // ---------------------------------------------------------------------------------------------------
  // Imports

  const inGrafanaUi = fileInfo.path.includes(`packages${path.sep}grafana-ui${path.sep}src`);
  const importPath = (file) => {
    if (!inGrafanaUi) {
      return file === 'mergeStylexProps' ? '@grafana/ui/internal' : `@grafana/ui/stylex/${file}`;
    }
    let rel = path.relative(path.dirname(path.resolve(fileInfo.path)), path.join(tokensDir, file));
    rel = rel.split(path.sep).join('/');
    return rel.startsWith('.') ? rel : `./${rel}`;
  };

  const stillUsed = (name) =>
    root
      .find(j.Identifier, { name })
      .filter((p) => p.parent.node.type !== 'ImportSpecifier')
      .size() > 0;

  emotionImport.forEach((p) => {
    p.node.specifiers = p.node.specifiers.filter((s) => stillUsed(s.local.name));
    if (p.node.specifiers.length === 0) {
      j(p).remove();
    }
  });
  root.find(j.ImportSpecifier).forEach((p) => {
    const name = p.node.local.name;
    if (['useStyles2', 'GrafanaTheme2'].includes(name) && !stillUsed(name)) {
      const decl = p.parent.node;
      decl.specifiers = decl.specifiers.filter((s) => s !== p.node);
      if (decl.specifiers.length === 0) {
        j(p.parent).remove();
      }
    }
  });

  const newImports = [
    j.importDeclaration([j.importNamespaceSpecifier(j.identifier('stylex'))], j.stringLiteral('@stylexjs/stylex')),
  ];
  if (usedConsts.size > 0) {
    newImports.push(
      j.importDeclaration(
        [...usedConsts].sort().map((c) => j.importSpecifier(j.identifier(c))),
        j.stringLiteral(importPath('constants.stylex'))
      )
    );
  }
  if (needsMerge) {
    newImports.push(
      j.importDeclaration(
        [j.importSpecifier(j.identifier('mergeStylexProps'))],
        j.stringLiteral(importPath('mergeStylexProps'))
      )
    );
  }
  if (usedGroups.size > 0) {
    newImports.push(
      j.importDeclaration(
        [...usedGroups].sort().map((g) => j.importSpecifier(j.identifier(g))),
        j.stringLiteral(importPath('tokens.stylex'))
      )
    );
  }
  const firstImport = root.find(j.ImportDeclaration).at(0);
  if (firstImport.size()) {
    firstImport.insertBefore(newImports);
  } else {
    root.get().node.program.body.unshift(...newImports);
  }

  return annotate();

  function annotate() {
    if (todos.length > 0) {
      const program = root.get().node.program;
      const first = program.body[0];
      first.comments = [...todos.map((t) => j.commentLine(` ${TODO}: ${t}`)), ...(first.comments || [])];
    }
    return root.toSource({ quote: 'single', trailingComma: true });
  }
};

module.exports.parser = 'tsx';
