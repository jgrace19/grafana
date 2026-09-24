#!/usr/bin/env node
'use strict';

// Audit: component styles that compete with a layered global rule and now win where they lost on `main`
// (stylex-conventions §3.10).
//
// On `main` the GlobalStyles `<Global>` sheet came after the `@emotion/css` sheet in production, so a global rule
// beat a component's Emotion rule on the same element when it was at least as specific; the legacy Sass sheet came
// before it, so a Sass rule had to be strictly more specific. Layering (`@layer grafana-global`,
// `@layer grafana-legacy`) puts both below every unlayered Emotion rule and every StyleX layer, so those component
// declarations apply now. `!important` global declarations still win and are ignored.
//
// It pairs each JSX element's global classes (literals in `className`/`cx(...)`, classes added by components that
// forward `className`), tag and attributes with the properties its own Emotion/StyleX styles set, plus component
// rules that target a global class through a descendant selector. It is static and heuristic: review every entry
// against the `main` rendering, then delete the dead override or keep the global look explicitly. Not a CI gate.
//
// Usage: node scripts/stylex/audit-global-overrides.js [--json] [files or directories...]
// Defaults to every .tsx file under packages/ and public/app/.

const babelParser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const selectorParser = require('postcss-selector-parser');
const sass = require('sass');

const { rootDir } = require('./options');

const GLOBAL_CSS = 'packages/grafana-ui/src/themes/GlobalStyles/GlobalStyles.global.css';
const SASS_ENTRY = 'public/sass/grafana.dark.scss';
const DEFAULT_SCOPE = ['packages', 'public/app'];

// ---------------------------------------------------------------------------------------------------------------
// Global rules

function compareSpec(x, y) {
  for (let i = 0; i < 3; i++) {
    if (x[i] !== y[i]) {
      return x[i] - y[i];
    }
  }
  return 0;
}

function specificity(sel) {
  let [a, b, c] = [0, 0, 0];
  sel.walk((n) => {
    if (n.type === 'id') {
      a++;
    } else if (n.type === 'class' || n.type === 'attribute') {
      b++;
    } else if (n.type === 'pseudo') {
      const v = n.value.toLowerCase();
      if (v.startsWith('::') || [':before', ':after', ':first-line', ':first-letter'].includes(v)) {
        c++;
      } else if ([':not', ':is', ':has'].includes(v)) {
        const best = n.nodes.map(specificity).sort((x, y) => compareSpec(y, x))[0] || [0, 0, 0];
        a += best[0];
        b += best[1];
        c += best[2];
        return false;
      } else if (v === ':where') {
        return false;
      } else {
        b++;
      }
    } else if (n.type === 'tag' && n.value !== '*') {
      c++;
    }
    return undefined;
  });
  return [a, b, c];
}

function keyCompound(sel) {
  const nodes = sel.nodes;
  let i = nodes.length - 1;
  while (i >= 0 && nodes[i].type !== 'combinator') {
    i--;
  }
  const compound = nodes.slice(i + 1);
  return {
    classes: compound.filter((n) => n.type === 'class').map((n) => n.value),
    tag: compound.find((n) => n.type === 'tag')?.value,
    pseudos: compound.filter((n) => n.type === 'pseudo').map((n) => n.value),
    attrs: compound.filter((n) => n.type === 'attribute').map((n) => n.toString()),
    ancestorClasses: nodes
      .slice(0, Math.max(i, 0))
      .filter((n) => n.type === 'class')
      .map((n) => n.value),
  };
}

/** Rules at least as specific as one class, with their normal (non-`!important`) declarations. */
function parseRules(css, source) {
  const rules = [];
  postcss.parse(css).walkRules((rule) => {
    if (rule.parent.type === 'atrule' && /keyframes/.test(rule.parent.name)) {
      return;
    }
    const values = {};
    rule.each((d) => {
      if (d.type === 'decl' && !d.important) {
        values[d.prop] = d.value;
      }
    });
    if (Object.keys(values).length === 0) {
      return;
    }
    try {
      selectorParser((selectors) => {
        selectors.each((sel) => {
          const spec = specificity(sel);
          if (compareSpec(spec, [0, 1, 0]) >= 0) {
            rules.push({ selector: sel.toString().trim(), spec, key: keyCompound(sel), values, source });
          }
        });
      }).processSync(rule.selector);
    } catch {
      // Browsers drop rules with invalid selectors, so they never won either.
    }
  });
  return rules;
}

function loadRules() {
  const globalCss = fs.readFileSync(path.join(rootDir, GLOBAL_CSS), 'utf8');
  const sassCss = sass.compile(path.join(rootDir, SASS_ENTRY), {
    loadPaths: [path.join(rootDir, 'public/sass'), path.join(rootDir, 'node_modules')],
    silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'slash-div', 'mixed-decls'],
    logger: sass.Logger.silent,
  }).css;
  return [...parseRules(globalCss, 'GlobalStyles'), ...parseRules(sassCss, 'Sass')];
}

// ---------------------------------------------------------------------------------------------------------------
// Properties

const SIDES = ['top', 'right', 'bottom', 'left'];

function longhands(prop) {
  const p = prop.toLowerCase();
  const out = new Set([p]);
  const add = (...xs) => xs.forEach((x) => out.add(x));
  if (p === 'padding' || p === 'margin') {
    add(...SIDES.map((s) => `${p}-${s}`));
  }
  if (p === 'inset') {
    add(...SIDES);
  }
  if (p === 'border') {
    add(...SIDES.flatMap((s) => ['width', 'style', 'color'].map((t) => `border-${s}-${t}`)));
    add('border-width', 'border-style', 'border-color');
  }
  if (/^border-(top|right|bottom|left)$/.test(p)) {
    add(...['width', 'style', 'color'].map((t) => `${p}-${t}`));
  }
  if (/^border-(width|style|color)$/.test(p)) {
    add(...SIDES.map((s) => `border-${s}-${p.split('-')[1]}`));
  }
  if (p === 'border-radius') {
    add('border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius');
  }
  if (p === 'background') {
    add('background-color', 'background-image', 'background-position', 'background-size', 'background-repeat');
  }
  if (p === 'font') {
    add('font-size', 'font-weight', 'font-family', 'line-height', 'font-style');
  }
  if (p === 'outline') {
    add('outline-width', 'outline-style', 'outline-color');
  }
  if (p === 'flex') {
    add('flex-grow', 'flex-shrink', 'flex-basis');
  }
  if (p === 'overflow') {
    add('overflow-x', 'overflow-y');
  }
  if (p === 'transition') {
    add('transition-property', 'transition-duration', 'transition-timing-function', 'transition-delay');
  }
  if (p === 'gap') {
    add('row-gap', 'column-gap');
  }
  if (p === 'all') {
    add('*');
  }
  return out;
}

/** Pairs of [component property, global property] that set a common longhand. */
function overlap(componentProps, globalProps) {
  const pairs = [];
  for (const cp of componentProps) {
    const lc = longhands(cp);
    for (const gp of globalProps) {
      const lg = longhands(gp);
      if (lc.has('*') || [...lc].some((x) => lg.has(x))) {
        pairs.push([cp, gp]);
      }
    }
  }
  return pairs;
}

const kebab = (k) =>
  k.startsWith('--')
    ? k
    : k.replace(/^(Webkit|Moz|ms)/, (p) => `-${p.toLowerCase()}`).replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
const normValue = (v) => String(v).replace(/\s+/g, ' ').replace(/'/g, '"').trim().toLowerCase();

// ---------------------------------------------------------------------------------------------------------------
// Component styles

function keyName(n) {
  if (!n) {
    return null;
  }
  if (n.type === 'Identifier') {
    return n.name;
  }
  if (n.type === 'StringLiteral') {
    return n.value;
  }
  if (n.type === 'TemplateLiteral' && n.expressions.length === 0) {
    return n.quasis[0].value.cooked;
  }
  return null;
}

function literalValue(v) {
  if (v.type === 'StringLiteral') {
    return v.value.trim();
  }
  if (v.type === 'NumericLiteral') {
    return v.value === 0 ? '0' : `${v.value}px`;
  }
  if (v.type === 'TemplateLiteral') {
    if (v.expressions.length === 0) {
      return v.quasis[0].value.cooked.trim();
    }
    if (v.quasis.some((q) => q.value.cooked.includes('!important'))) {
      return '? !important';
    }
  }
  return null;
}

const emptyInfo = () => ({ base: new Map(), pseudo: new Map(), nested: [] });

function addBase(info, prop, value) {
  const set = info.base.get(prop) || new Set();
  set.add(value);
  info.base.set(prop, set);
}

function mergeInfo(into, from) {
  for (const [p, vs] of from.base) {
    vs.forEach((v) => addBase(into, p, v));
  }
  for (const [k, ps] of from.pseudo) {
    into.pseudo.set(k, new Set([...(into.pseudo.get(k) || []), ...ps]));
  }
  into.nested.push(...from.nested);
  return into;
}

function emotionObject(obj, info = emptyInfo()) {
  for (const p of obj.properties) {
    const k = p.type === 'ObjectProperty' && !p.computed ? keyName(p.key) : null;
    if (!k) {
      continue;
    }
    const sel = k.trim();
    if (p.value.type === 'ObjectExpression') {
      const inner = emotionObject(p.value);
      if (/^&?(:[a-z-]+(\([^)]*\))?)+$/.test(sel) && !sel.includes('::')) {
        const state = sel.replace(/^&/, '');
        info.pseudo.set(state, new Set([...(info.pseudo.get(state) || []), ...inner.base.keys()]));
      } else if (/\.[a-zA-Z]/.test(sel)) {
        info.nested.push({ selector: sel, props: [...inner.base.keys()], line: p.loc.start.line });
      }
    } else if (!/^[@&:]/.test(sel) && sel !== 'label') {
      addBase(info, kebab(sel), literalValue(p.value));
    }
  }
  return info;
}

function emotionTemplate(tpl) {
  const info = emptyInfo();
  try {
    postcss.parse(`.x{${tpl.quasis.map((q) => q.value.raw).join('0')}}`).first.each((n) => {
      if (n.type === 'decl' && n.prop !== 'label') {
        addBase(info, n.prop, tpl.expressions.length ? null : n.value.trim());
      } else if (n.type === 'rule') {
        const props = [];
        n.walkDecls((d) => props.push(d.prop));
        const sel = n.selector.trim();
        if (/^&(:[a-z-]+)+$/.test(sel)) {
          info.pseudo.set(sel.slice(1), new Set(props));
        } else if (/\.[a-zA-Z]/.test(sel)) {
          info.nested.push({ selector: sel, props, line: tpl.loc.start.line });
        }
      }
    });
  } catch {
    // Interpolated selectors: skip.
  }
  return info;
}

function stylexNamespace(value) {
  const info = emptyInfo();
  let obj = value;
  if (obj.type === 'ArrowFunctionExpression') {
    obj = obj.body.type === 'ObjectExpression' ? obj.body : obj.body.expression;
  }
  if (!obj || obj.type !== 'ObjectExpression') {
    return info;
  }
  for (const p of obj.properties) {
    const k = p.type === 'ObjectProperty' && !p.computed ? keyName(p.key) : null;
    if (!k || k.startsWith('::')) {
      continue;
    }
    if (p.value.type !== 'ObjectExpression') {
      if (p.value.type !== 'NullLiteral') {
        addBase(info, kebab(k), literalValue(p.value));
      }
      continue;
    }
    for (const c of p.value.properties) {
      const ck = c.type === 'ObjectProperty' ? keyName(c.key) : null;
      if (!ck || c.value.type === 'NullLiteral') {
        continue;
      }
      if (ck === 'default') {
        addBase(info, kebab(k), literalValue(c.value));
      } else if (ck.startsWith(':')) {
        info.pseudo.set(ck, new Set([...(info.pseudo.get(ck) || []), kebab(k)]));
      }
    }
  }
  return info;
}

const isCssCall = (n) => n?.type === 'CallExpression' && n.callee.type === 'Identifier' && n.callee.name === 'css';
const isCssTemplate = (n) =>
  n?.type === 'TaggedTemplateExpression' && n.tag.type === 'Identifier' && n.tag.name === 'css';

function cssInfo(node) {
  if (isCssCall(node)) {
    return node.arguments.reduce((info, a) => {
      if (a.type === 'ObjectExpression') {
        return mergeInfo(info, emotionObject(a));
      }
      if (a.type === 'TemplateLiteral') {
        return mergeInfo(info, emotionTemplate(a));
      }
      return info;
    }, emptyInfo());
  }
  return isCssTemplate(node) ? emotionTemplate(node.quasi) : null;
}

const astCache = new Map();
function parseFile(file) {
  if (!astCache.has(file)) {
    let ast = null;
    try {
      ast = babelParser.parse(fs.readFileSync(file, 'utf8'), {
        sourceType: 'module',
        plugins: ['typescript', 'jsx', 'decorators-legacy'],
        errorRecovery: true,
      });
    } catch {
      // Unparseable file: skip it.
    }
    astCache.set(file, ast);
  }
  return astCache.get(file);
}

/** Style namespaces by key: Emotion `key: css(...)` and StyleX `create({ key })`, incl. relative style modules. */
const namespaceCache = new Map();
function namespaces(file) {
  if (namespaceCache.has(file)) {
    return namespaceCache.get(file);
  }
  const map = new Map();
  namespaceCache.set(file, map);
  const ast = parseFile(file);
  if (!ast) {
    return map;
  }
  traverse(ast, {
    ObjectProperty(p) {
      const k = keyName(p.node.key);
      const info = k && cssInfo(p.node.value);
      if (info) {
        map.set(k, mergeInfo(map.get(k) || { ...emptyInfo(), line: p.node.loc.start.line }, info));
      }
    },
    CallExpression(p) {
      const { callee, arguments: args } = p.node;
      const isCreate =
        (callee.type === 'MemberExpression' &&
          keyName(callee.property) === 'create' &&
          callee.object.name === 'stylex') ||
        (callee.type === 'Identifier' && callee.name === 'create');
      if (isCreate && args[0]?.type === 'ObjectExpression') {
        for (const ns of args[0].properties) {
          const k = ns.type === 'ObjectProperty' ? keyName(ns.key) : null;
          if (k) {
            map.set(k, { ...stylexNamespace(ns.value), line: ns.loc.start.line });
          }
        }
      }
    },
  });
  for (const node of ast.program.body) {
    if (node.type !== 'ImportDeclaration' || !node.source.value.startsWith('.')) {
      continue;
    }
    if (!node.specifiers.some((s) => /[Ss]tyles?/.test(s.local.name))) {
      continue;
    }
    const base = path.resolve(path.dirname(file), node.source.value);
    const target = [`${base}.ts`, `${base}.tsx`, `${base}/index.ts`].find((f) => fs.existsSync(f));
    if (target) {
      for (const [k, v] of namespaces(target)) {
        if (!map.has(k)) {
          map.set(k, v);
        }
      }
    }
  }
  return map;
}

// ---------------------------------------------------------------------------------------------------------------
// Class expressions

function resolveBinding(name, scope) {
  const binding = scope?.getBinding(name);
  if (!binding) {
    return null;
  }
  const n = binding.path.node;
  if (n.type === 'VariableDeclarator' && n.init) {
    return { node: n.init, scope: binding.path.scope };
  }
  if (n.type === 'FunctionDeclaration') {
    return { node: n, scope: binding.path.scope };
  }
  return null;
}

function returnedExpressions(fn) {
  if (fn.type === 'ArrowFunctionExpression' && fn.body.type !== 'BlockStatement') {
    return [fn.body];
  }
  const found = [];
  const walk = (node) => {
    if (!node || typeof node.type !== 'string' || (node !== fn && /Function/.test(node.type))) {
      return;
    }
    if (node.type === 'ReturnStatement' && node.argument) {
      found.push(node.argument);
    }
    for (const [k, v] of Object.entries(node)) {
      if (k !== 'loc' && v && typeof v === 'object') {
        (Array.isArray(v) ? v : [v]).forEach(walk);
      }
    }
  };
  walk(fn.body);
  return found;
}

const CX = /^(cx|cn|clsx|classNames|classnames)$/;

/** Literal class names, style namespace references and inline `css()` in a class expression. */
function collectClasses(expr, out, scope, depth = 0, inCx = false) {
  if (!expr || depth > 4) {
    return out;
  }
  const recur = (e, sc = scope, d = depth, cx = inCx) => collectClasses(e, out, sc, d, cx);
  switch (expr.type) {
    case 'StringLiteral':
      expr.value.split(/\s+/).forEach((c) => c && out.literals.add(c));
      break;
    case 'TemplateLiteral':
      expr.quasis.forEach((q) => q.value.cooked.split(/\s+/).forEach((c) => c && out.literals.add(c)));
      expr.expressions.forEach((e) => recur(e));
      break;
    case 'JSXExpressionContainer':
    case 'TSAsExpression':
    case 'TSNonNullExpression':
      recur(expr.expression);
      break;
    case 'ConditionalExpression':
      recur(expr.consequent);
      recur(expr.alternate);
      break;
    case 'LogicalExpression':
    case 'BinaryExpression':
      recur(expr.left);
      recur(expr.right);
      break;
    case 'ArrayExpression':
      expr.elements.forEach((e) => recur(e));
      break;
    case 'ObjectExpression':
      if (inCx) {
        for (const p of expr.properties) {
          if (p.type === 'ObjectProperty' && p.computed) {
            recur(p.key);
          } else if (p.type === 'ObjectProperty') {
            (keyName(p.key) || '').split(/\s+/).forEach((c) => c && out.literals.add(c));
          }
        }
      }
      break;
    case 'TaggedTemplateExpression':
      if (isCssTemplate(expr)) {
        out.inline.push(cssInfo(expr));
      }
      break;
    case 'CallExpression': {
      const { callee } = expr;
      if (isCssCall(expr)) {
        out.inline.push(cssInfo(expr));
      } else if (callee.type === 'Identifier' && /^use(Memo|Callback)$/.test(callee.name) && expr.arguments[0]) {
        returnedExpressions(expr.arguments[0]).forEach((e) => recur(e, scope, depth + 1));
      } else if (callee.type === 'Identifier' && !CX.test(callee.name)) {
        const r = resolveBinding(callee.name, scope);
        const fn = r && /Function/.test(r.node.type) ? r.node : null;
        if (fn) {
          returnedExpressions(fn).forEach((e) => recur(e, r.scope, depth + 1, false));
        } else {
          expr.arguments.forEach((a) => recur(a, scope, depth, false));
        }
      } else {
        const cx = callee.type === 'Identifier' && CX.test(callee.name);
        expr.arguments.forEach((a) => recur(a, scope, depth, cx));
      }
      break;
    }
    case 'MemberExpression': {
      const k = keyName(expr.property);
      if (k === 'className') {
        out.forwardsClassName = true;
      } else if (k) {
        out.refs.push(k);
      }
      break;
    }
    case 'Identifier': {
      if (expr.name === 'className') {
        out.forwardsClassName = true;
        break;
      }
      const r = resolveBinding(expr.name, scope);
      if (r && !/Function/.test(r.node.type)) {
        recur(r.node, r.scope, depth + 1);
      }
      break;
    }
  }
  return out;
}

const newClassInfo = () => ({ literals: new Set(), refs: [], inline: [], forwardsClassName: false });

function openingElementClasses(opening, scope) {
  const out = newClassInfo();
  for (const a of opening.attributes) {
    if (a.type === 'JSXAttribute' && (a.name.name === 'className' || a.name.name === 'class')) {
      collectClasses(a.value, out, scope);
    } else if (a.type === 'JSXSpreadAttribute') {
      collectClasses(a.argument, out, scope);
    }
  }
  return out;
}

function tagName(opening) {
  const n = opening.name;
  if (n.type === 'JSXIdentifier') {
    return n.name;
  }
  return n.type === 'JSXMemberExpression' ? `${n.object.name}.${n.property.name}` : null;
}

function attributes(opening) {
  const attrs = {};
  for (const a of opening.attributes) {
    if (a.type !== 'JSXAttribute') {
      continue;
    }
    const v = a.value;
    const e = v?.type === 'JSXExpressionContainer' ? v.expression : null;
    attrs[a.name.name] =
      v == null
        ? true
        : v.type === 'StringLiteral'
          ? v.value
          : e?.type === 'NumericLiteral'
            ? String(e.value)
            : e?.type === 'UnaryExpression' && e.argument.type === 'NumericLiteral'
              ? `${e.operator}${e.argument.value}`
              : '{expr}';
  }
  return attrs;
}

function attributeMatches(attr, attrs) {
  const m = attr.match(/^\[\s*([\w-]+)\s*(?:([~|^$*]?=)\s*['"]?([^'"\]]*)['"]?)?\s*\]$/);
  if (!m) {
    return false;
  }
  const [, name, op, val] = m;
  const jsxName = { tabindex: 'tabIndex' }[name] || name;
  if (!(jsxName in attrs)) {
    return false;
  }
  const v = attrs[jsxName];
  return !op || v === '{expr}' || (op === '=' ? v === val : true);
}

// ---------------------------------------------------------------------------------------------------------------
// Audit

function listFiles(args) {
  const targets = args.length > 0 ? args.map((a) => path.resolve(a)) : DEFAULT_SCOPE.map((d) => path.join(rootDir, d));
  const specs = targets.flatMap((t) => (fs.statSync(t).isDirectory() ? [`${t}/*.tsx`] : [t]));
  const out = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '--', ...specs], {
    cwd: rootDir,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
  return out
    .split('\n')
    .filter((f) => f.endsWith('.tsx') && !/\.(test|story)\.tsx$|node_modules|__mocks__/.test(f))
    .map((f) => path.join(rootDir, f));
}

function enclosingName(p) {
  let name = null;
  for (let cur = p; cur; cur = cur.parentPath) {
    const n = cur.node;
    if ((n.type === 'FunctionDeclaration' || n.type === 'ClassDeclaration') && n.id) {
      name = n.id.name;
    } else if (n.type === 'VariableDeclarator' && n.id.type === 'Identifier') {
      name = n.id.name;
    }
  }
  return name;
}

function eachElement(file, visit) {
  const ast = parseFile(file);
  if (ast) {
    traverse(ast, { JSXOpeningElement: (p) => visit(p) });
  }
}

/** Components whose element carries global classes and forwards the consumer's `className`. */
function findForwarders(files, globalClasses) {
  const forwarders = new Map();
  for (const file of files) {
    eachElement(file, (p) => {
      const cls = openingElementClasses(p.node, p.scope);
      const global = [...cls.literals].filter((c) => globalClasses.has(c));
      const name = global.length && cls.forwardsClassName ? enclosingName(p) : null;
      if (name && /^[A-Z]/.test(name)) {
        forwarders.set(name, { classes: global, file });
      }
    });
  }
  return forwarders;
}

function importsForwarder(file, tag, forwarder) {
  const [local, member] = tag.split('.');
  if (member) {
    return local === 'LegacyForms' && /Legacy/.test(forwarder.file);
  }
  if (file === forwarder.file) {
    return true;
  }
  for (const node of parseFile(file).program.body) {
    const spec = node.type === 'ImportDeclaration' && node.specifiers.find((s) => s.local.name === local);
    if (spec) {
      return (
        node.source.value.startsWith('.') &&
        forwarder.file.startsWith(path.resolve(path.dirname(file), node.source.value))
      );
    }
  }
  return false;
}

function beatsOnMain(rule, componentSpec) {
  const c = compareSpec(rule.spec, componentSpec);
  return rule.source === 'GlobalStyles' ? c >= 0 : c > 0;
}

function audit(files) {
  const rules = loadRules();
  const globalClasses = new Set(rules.flatMap((r) => r.key.classes));
  const forwarders = findForwarders(files, globalClasses);
  const findings = [];

  for (const file of files) {
    const ns = namespaces(file);
    const rel = path.relative(rootDir, file);

    eachElement(file, (p) => {
      const tag = tagName(p.node);
      const isDom = Boolean(tag && /^[a-z]/.test(tag));
      const attrs = attributes(p.node);
      const cls = openingElementClasses(p.node, p.scope);
      const classes = new Set([...cls.literals].filter((c) => globalClasses.has(c)));
      if (!isDom && tag && forwarders.has(tag) && importsForwarder(file, tag, forwarders.get(tag))) {
        forwarders.get(tag).classes.forEach((c) => classes.add(c));
      }
      const ancestors = new Set();
      for (let cur = p.parentPath.parentPath; cur; cur = cur.parentPath) {
        if (cur.node.type === 'JSXElement') {
          const o = cur.node.openingElement;
          openingElementClasses(o, cur.scope).literals.forEach((c) => ancestors.add(c));
          const t = tagName(o);
          forwarders.get(t)?.classes.forEach((c) => ancestors.add(c));
        }
      }

      const comp = emptyInfo();
      const refs = [];
      for (const r of cls.refs) {
        if (ns.has(r)) {
          mergeInfo(comp, ns.get(r));
          refs.push(r);
        }
      }
      cls.inline.filter(Boolean).forEach((i) => mergeInfo(comp, i));
      if (comp.base.size === 0 && comp.pseudo.size === 0) {
        return;
      }

      for (const rule of rules) {
        const k = rule.key;
        if (!k.classes.length && !k.tag && !k.attrs.length) {
          continue;
        }
        if (
          !k.classes.every((c) => classes.has(c)) ||
          !k.ancestorClasses.every((c) => ancestors.has(c) || classes.has(c))
        ) {
          continue;
        }
        if ((k.tag && !(isDom && k.tag === tag.toLowerCase())) || !k.attrs.every((a) => attributeMatches(a, attrs))) {
          continue;
        }
        const stateProps = new Set(
          k.pseudos.flatMap((rp) =>
            [...comp.pseudo]
              .filter(([cp]) => cp === rp || cp.includes(rp) || (/focus/.test(cp) && /focus/.test(rp)))
              .flatMap(([, s]) => [...s])
          )
        );
        const hits = [];
        if (beatsOnMain(rule, [0, 1, 0])) {
          for (const [cp, gp] of overlap(comp.base.keys(), Object.keys(rule.values))) {
            const values = [...comp.base.get(cp)];
            const important = values.every((v) => v && v.includes('!important'));
            const same = cp === gp && values.every((v) => v != null && normValue(v) === normValue(rule.values[gp]));
            if (!important && !same && !overlap(stateProps, [gp]).length) {
              hits.push(`${cp}: ${values.map((v) => v ?? '…').join(' | ')} (main: ${gp}: ${rule.values[gp]})`);
            }
          }
        }
        for (const [state, props] of comp.pseudo) {
          if (k.pseudos.includes(state) && beatsOnMain(rule, [0, 2, 0])) {
            overlap(props, Object.keys(rule.values)).forEach(([cp, gp]) => hits.push(`${state} ${cp} (main: ${gp})`));
          }
        }
        if (hits.length) {
          findings.push({
            file: rel,
            line: p.node.loc.start.line,
            element: tag,
            rule: rule.selector,
            source: rule.source,
            styles: refs,
            hits,
          });
        }
      }
    });

    for (const [key, info] of ns) {
      for (const n of info.nested || []) {
        const target = n.selector.match(/\.([a-zA-Z][\w-]*)\s*$/);
        if (!target || !globalClasses.has(target[1])) {
          continue;
        }
        const selectorClasses = (n.selector.match(/\.[a-zA-Z]|:[a-z]|\[/g) || []).length;
        const compSpec = [0, 1 + selectorClasses, (n.selector.match(/(^|[\s>+~])[a-z]+/g) || []).length];
        for (const rule of rules) {
          if (!rule.key.classes.includes(target[1]) || !beatsOnMain(rule, compSpec)) {
            continue;
          }
          const pairs = overlap(n.props, Object.keys(rule.values));
          if (pairs.length) {
            findings.push({
              file: rel,
              line: n.line,
              element: `'${n.selector}' in ${key}`,
              rule: rule.selector,
              source: rule.source,
              styles: [key],
              hits: pairs.map(([cp, gp]) => `${cp} (main: ${gp})`),
            });
          }
        }
      }
    }
  }
  return findings;
}

function main() {
  const args = process.argv.slice(2);
  const json = args.includes('--json');
  const findings = audit(listFiles(args.filter((a) => a !== '--json')));
  if (json) {
    console.log(JSON.stringify(findings, null, 2));
    return;
  }
  for (const f of findings) {
    console.log(`${f.file}:${f.line} <${f.element}> vs ${f.source} \`${f.rule}\`\n    ${f.hits.join('\n    ')}`);
  }
  console.log(
    `audit-global-overrides: ${findings.length} candidate(s) in ${new Set(findings.map((f) => f.file)).size} file(s)`
  );
}

if (require.main === module) {
  main();
}

module.exports = { audit, listFiles };
