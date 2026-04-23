import { execFileSync } from 'node:child_process';

const maxChangedLines = Number(process.env.MAX_CHANGED_LINES ?? '400');

function git(args: string[]): string {
  return execFileSync('git', args, { encoding: 'utf-8', timeout: 30_000 }).trim();
}

const changedFiles = git(['diff', '--name-only']).split('\n').filter(Boolean);

if (changedFiles.length === 0) {
  console.log('No file changes detected after Cursor auto-fix.');
  process.exit(0);
}

const forbiddenMatchers: Array<{ test: (path: string) => boolean; reason: string }> = [
  {
    test: (path) => path.startsWith('.github/'),
    reason: 'workflow and repository automation changes are out of scope',
  },
  {
    test: (path) => path === 'package.json' || path === 'yarn.lock',
    reason: 'package manifest changes are out of scope',
  },
  {
    test: (path) => path.startsWith('pkg/services/'),
    reason: 'business-logic changes under pkg/services are not allowed',
  },
  {
    test: (path) => /\.test\.[jt]sx?$/.test(path) || /_test\.go$/.test(path),
    reason: 'test source changes are not allowed in this auto-fix workflow',
  },
];

for (const file of changedFiles) {
  const match = forbiddenMatchers.find((matcher) => matcher.test(file));
  if (match) {
    console.error(`Guard rejected ${file}: ${match.reason}`);
    process.exit(1);
  }
}

const numstat = git(['diff', '--numstat']).split('\n').filter(Boolean);
let changedLines = 0;

for (const line of numstat) {
  const [added, removed] = line.split('\t', 3);
  if (!added || !removed || added === '-' || removed === '-') {
    continue;
  }
  changedLines += Number(added) + Number(removed);
}

if (changedLines > maxChangedLines) {
  console.error(`Guard rejected diff with ${changedLines} changed lines (limit: ${maxChangedLines}).`);
  process.exit(1);
}

console.log(`Guard accepted ${changedFiles.length} file(s) with ${changedLines} changed lines.`);
