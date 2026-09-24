#!/usr/bin/env node
'use strict';

// Fails when StyleX compiles a style property to no CSS.
//
// 1. Compiles every file with the shared options (scripts/stylex/options.js), which set
//    `propertyValidationMode: 'throw'`, and reports every compile error in one run rather than webpack's first.
// 2. Cross-checks every property key written in a `stylex.create` namespace against the CSS the compiler emitted
//    for that file, so a compiler upgrade that starts dropping properties silently is caught too. The check is
//    per file: a property dropped in one namespace is missed if another namespace in the file emits it.
//
// Usage: node scripts/stylex/check-dropped-props.js [files or directories...]
// Defaults to every .ts/.tsx file importing @stylexjs/stylex under packages/ and public/app/.

const babel = require('@babel/core');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const { getStylexBabelOptions, rootDir } = require('./options');

const STYLEX_IMPORT = /from\s*['"]@stylexjs\/stylex['"]/;
const DEFAULT_SCOPE = ['packages', 'public/app'];

// 'property-specificity' aliases that emit a differently named property (StyleX 0.19).
const RENAMED_BY_COMPILER = new Set([
  'blockSize',
  'inlineSize',
  'minBlockSize',
  'minInlineSize',
  'maxBlockSize',
  'maxInlineSize',
  'borderHorizontalWidth',
  'borderHorizontalStyle',
  'borderHorizontalColor',
  'borderVerticalWidth',
  'borderVerticalStyle',
  'borderVerticalColor',
  'borderBlockStartColor',
  'borderBlockEndColor',
  'borderBlockStartStyle',
  'borderBlockEndStyle',
  'borderBlockStartWidth',
  'borderBlockEndWidth',
  'borderStartColor',
  'borderEndColor',
  'borderStartStyle',
  'borderEndStyle',
  'borderStartWidth',
  'borderEndWidth',
  'borderTopStartRadius',
  'borderTopEndRadius',
  'borderBottomStartRadius',
  'borderBottomEndRadius',
  'containIntrinsicBlockSize',
  'containIntrinsicInlineSize',
  'marginBlockStart',
  'marginBlockEnd',
  'marginStart',
  'marginEnd',
  'marginHorizontal',
  'marginVertical',
  'overflowBlock',
  'overflowInline',
  'paddingBlockStart',
  'paddingBlockEnd',
  'paddingStart',
  'paddingEnd',
  'paddingHorizontal',
  'paddingVertical',
  'scrollMarginBlockStart',
  'scrollMarginBlockEnd',
  'insetBlockStart',
  'insetBlockEnd',
  'start',
  'end',
]);

function listFiles(args) {
  const targets =
    args.length > 0 ? args.map((arg) => path.resolve(arg)) : DEFAULT_SCOPE.map((dir) => path.join(rootDir, dir));
  // Plain git pathspecs: `*` also matches `/`, so `<dir>/*.ts` covers every depth.
  const pathspecs = targets.flatMap((target) =>
    fs.statSync(target).isDirectory() ? [`${target}/*.ts`, `${target}/*.tsx`] : [target]
  );
  const out = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '--', ...pathspecs], {
    encoding: 'utf8',
    cwd: rootDir,
    maxBuffer: 64 * 1024 * 1024,
  });
  return [...new Set(out.split('\n').filter(Boolean))]
    .map((file) => path.resolve(rootDir, file))
    .filter((file) => STYLEX_IMPORT.test(fs.readFileSync(file, 'utf8')));
}

function toCssProperty(key) {
  if (key.startsWith('--')) {
    return key;
  }
  return key
    .replace(/^(Webkit|Moz|ms)/, (prefix) => `-${prefix.toLowerCase()}`)
    .replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
}

function keyName(node) {
  if (node.type === 'Identifier') {
    return node.name;
  }
  if (node.type === 'StringLiteral') {
    return node.value;
  }
  return null;
}

function isNullOnly(node) {
  if (node.type === 'NullLiteral' || (node.type === 'Identifier' && node.name === 'undefined')) {
    return true;
  }
  if (node.type === 'ObjectExpression') {
    return node.properties.every((prop) => prop.type === 'ObjectProperty' && isNullOnly(prop.value));
  }
  return false;
}

/** Style properties written in the namespace, with their source locations. */
function collectProperties(styleObject, found) {
  for (const prop of styleObject.properties) {
    if (prop.type !== 'ObjectProperty' || prop.computed) {
      continue;
    }
    const key = keyName(prop.key);
    if (!key) {
      continue;
    }
    // Pseudo-elements and legacy contextual styles nest a style object at namespace level.
    if (key.startsWith(':') || key.startsWith('@')) {
      if (prop.value.type === 'ObjectExpression') {
        collectProperties(prop.value, found);
      }
      continue;
    }
    if (!isNullOnly(prop.value)) {
      found.push({ key, line: prop.key.loc.start.line });
    }
  }
}

function namespaceStyleObject(value) {
  if (value.type === 'ObjectExpression') {
    return value;
  }
  if (value.type === 'ArrowFunctionExpression') {
    let body = value.body;
    while (body.type === 'TSAsExpression' || body.type === 'ParenthesizedExpression') {
      body = body.expression;
    }
    return body.type === 'ObjectExpression' ? body : null;
  }
  return null;
}

function writtenProperties(ast) {
  const namespaces = new Set();
  const creates = new Set();
  const found = [];
  babel.traverse(ast, {
    ImportDeclaration(p) {
      if (p.node.source.value !== '@stylexjs/stylex') {
        return;
      }
      for (const spec of p.node.specifiers) {
        if (spec.type === 'ImportNamespaceSpecifier' || spec.type === 'ImportDefaultSpecifier') {
          namespaces.add(spec.local.name);
        } else if (spec.type === 'ImportSpecifier' && keyName(spec.imported) === 'create') {
          creates.add(spec.local.name);
        }
      }
    },
    CallExpression(p) {
      const { callee, arguments: args } = p.node;
      const isCreate =
        (callee.type === 'MemberExpression' &&
          callee.object.type === 'Identifier' &&
          namespaces.has(callee.object.name) &&
          keyName(callee.property) === 'create') ||
        (callee.type === 'Identifier' && creates.has(callee.name));
      if (!isCreate || args[0]?.type !== 'ObjectExpression') {
        return;
      }
      for (const namespace of args[0].properties) {
        if (namespace.type !== 'ObjectProperty') {
          continue;
        }
        const styleObject = namespaceStyleObject(namespace.value);
        if (styleObject) {
          collectProperties(styleObject, found);
        }
      }
    },
  });
  return found;
}

function emittedProperties(rules) {
  const properties = new Set();
  for (const [, { ltr }] of rules) {
    for (const match of ltr.matchAll(/[{;]\s*(-{0,2}[a-zA-Z][\w-]*)\s*:/g)) {
      properties.add(match[1]);
    }
  }
  return properties;
}

function checkFile(file) {
  const relative = path.relative(rootDir, file);
  const source = fs.readFileSync(file, 'utf8');
  if (!STYLEX_IMPORT.test(source)) {
    return [];
  }
  const parserPlugins = [
    [require.resolve('@babel/plugin-syntax-typescript'), { isTSX: file.endsWith('.tsx') }],
    require.resolve('@babel/plugin-syntax-jsx'),
  ];
  const ast = babel.parseSync(source, { filename: file, babelrc: false, configFile: false, plugins: parserPlugins });
  const written = writtenProperties(ast);
  let result;
  try {
    result = babel.transformSync(source, {
      filename: file,
      babelrc: false,
      configFile: false,
      code: false,
      plugins: [...parserPlugins, [require.resolve('@stylexjs/babel-plugin'), getStylexBabelOptions()]],
    });
  } catch (error) {
    const message = String(error.message).split('\n')[0].replace(`${file}: `, '');
    // Shorthand errors carry no location; point at the first use of the property they name.
    const unsupported = message.match(/^`?(\w+)`? is not supported/);
    const line = error.loc?.line ?? written.find(({ key }) => unsupported && key === unsupported[1])?.line;
    return [`${relative}${line ? `:${line}` : ''}: ${message}`];
  }

  const emitted = emittedProperties(result.metadata.stylex || []);
  return written
    .filter(({ key }) => !emitted.has(toCssProperty(key)) && !RENAMED_BY_COMPILER.has(key))
    .map(({ key, line }) => `${relative}:${line}: \`${key}\` compiles to no CSS`);
}

function main() {
  const files = listFiles(process.argv.slice(2));
  const problems = files.flatMap(checkFile);
  for (const problem of problems) {
    console.error(problem);
  }
  console.log(`check-dropped-props: ${files.length} StyleX files, ${problems.length} problem(s)`);
  process.exitCode = problems.length > 0 ? 1 : 0;
}

if (require.main === module) {
  main();
}

module.exports = { checkFile, listFiles };
