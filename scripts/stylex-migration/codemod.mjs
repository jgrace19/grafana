#!/usr/bin/env node
/**
 * Placeholder entry point for the StyleX jscodeshift codemod (Phase 3).
 *
 * Intended usage (not wired yet):
 *   yarn stylex:codemod -- path/to/Component.tsx
 *
 * The codemod will eventually automate:
 * - static `css({ ... })` objects that only use theme tokens → `stylex.create`
 * - `theme.spacing(n)` → spacing token references in `.stylex.ts` files
 *
 * Manual follow-up is required for nested selectors, keyframes, color math, and
 * third-party DOM styling. See contribute/style-guides/stylex-migration.md.
 *
 * Bulk migration scripts in this directory (`migrate_*.py`, `*.mjs`) remain the
 * supported path until the jscodeshift transform lands here.
 */
import process from 'node:process';

const args = process.argv.slice(2).filter((arg) => arg !== '--');

if (args.length === 0) {
  console.error('Usage: yarn stylex:codemod -- <file-or-directory> [...]');
  console.error('');
  console.error('The jscodeshift transform is not implemented yet.');
  console.error('Use scripts/stylex-migration/migrate_*.py for batch migrations.');
  process.exit(1);
}

console.error(
  `stylex:codemod is not implemented yet (requested: ${args.join(', ')}). See scripts/stylex-migration/codemod.mjs header.`
);
process.exit(1);
