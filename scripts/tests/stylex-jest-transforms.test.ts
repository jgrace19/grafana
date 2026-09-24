import { readFileSync } from 'fs';
import path from 'path';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { compileStylex } = require('../jest/stylex-compile');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const swcTransform = require('../jest/stylex-swc-transform');

// Decoupled plugin workspaces run Jest through @grafana/plugin-configs/jest with @swc/jest and resolve
// @grafana/ui to source, so any StyleX call that reaches them uncompiled throws at import time.
const constantsFile = path.resolve(__dirname, '../../packages/grafana-ui/src/themes/stylex/constants.stylex.ts');
const componentFile = path.resolve(__dirname, '../../packages/grafana-ui/src/components/Box.tsx');
const componentSource = `
import * as stylex from '@stylexjs/stylex';
import type { ReactNode } from 'react';

const styles = stylex.create({
  box: { display: 'flex', padding: 4 },
});

export const Box = ({ children }: { children: ReactNode }) => <div {...stylex.props(styles.box)}>{children}</div>;
`;
const STYLEX_CALL = /stylex\.(create|defineConsts|defineVars)\(/;

function swcProcess(src: string, filename: string): string {
  const transformer = swcTransform.createTransformer({
    jsc: { parser: { syntax: 'typescript', tsx: true }, transform: { react: { runtime: 'automatic' } } },
  });
  return transformer.process(src, filename, { supportsStaticESM: false, config: {}, instrument: false }).code;
}

describe('StyleX Jest transforms', () => {
  it('compiles StyleX calls and keeps TypeScript and JSX for the wrapped transformer', () => {
    const code = compileStylex(componentSource, componentFile);
    expect(code).not.toMatch(STYLEX_CALL);
    expect(code).toContain('Box__styles.box');
    expect(code).toContain('import type { ReactNode }');
    expect(code).toContain('<div');
  });

  it('leaves files without a StyleX import untouched', () => {
    const plain = 'export const answer: number = 42;';
    expect(compileStylex(plain, componentFile)).toBe(plain);
  });

  it('runs the StyleX pass before @swc/jest for plugin workspaces', () => {
    const component = swcProcess(componentSource, componentFile);
    expect(component).not.toMatch(STYLEX_CALL);
    expect(component).toContain('Box__styles.box');
    expect(component).toContain('react/jsx-runtime');

    expect(swcProcess(readFileSync(constantsFile, 'utf8'), constantsFile)).not.toMatch(STYLEX_CALL);
  });
});
