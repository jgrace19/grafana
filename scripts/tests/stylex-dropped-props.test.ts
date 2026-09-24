import { mkdtempSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import path from 'path';

const component = (styles: string) => `
import * as stylex from '@stylexjs/stylex';

const styles = stylex.create(${styles});

export const Box = () => <div {...stylex.props(styles.box)} />;
`;

function writeFixture(source: string): string {
  const file = path.join(mkdtempSync(path.join(tmpdir(), 'stylex-dropped-')), 'Box.tsx');
  writeFileSync(file, source);
  return file;
}

function loadChecker(propertyValidationMode?: 'silent') {
  jest.resetModules();
  if (propertyValidationMode) {
    jest.doMock('../stylex/options', () => {
      const actual = jest.requireActual('../stylex/options');
      return {
        ...actual,
        getStylexBabelOptions: (opts: object) => ({ ...actual.getStylexBabelOptions(opts), propertyValidationMode }),
      };
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('../stylex/check-dropped-props');
}

describe('check-dropped-props', () => {
  afterEach(() => jest.dontMock('../stylex/options'));

  it('reports shorthands the compiler cannot expand, static or dynamic', () => {
    const { checkFile } = loadChecker();
    const file = writeFixture(
      component(`{
  box: { backgroundColor: 'red' },
  striped: (color: string) => ({ background: color }),
}`)
    );
    expect(checkFile(file)).toEqual([expect.stringMatching(/Box\.tsx:\d+: background is not supported/)]);
  });

  it('reports properties that compile to no CSS', () => {
    const { checkFile } = loadChecker('silent');
    const file = writeFixture(
      component(`{
  box: { color: 'red', background: { default: 'white', ':hover': 'grey' } },
}`)
    );
    expect(checkFile(file)).toEqual([expect.stringMatching(/Box\.tsx:5: `background` compiles to no CSS/)]);
  });

  it('accepts null-only properties, pseudo-elements, custom properties and aliases', () => {
    const { checkFile } = loadChecker();
    const file = writeFixture(
      component(`{
  box: {
    color: null,
    marginStart: 4,
    '--gf-local': '1px',
    '::before': { content: '""', backgroundColor: 'red' },
    outline: { default: null, ':focus-visible': '2px solid red' },
  },
  size: (width: string) => ({ width }),
}`)
    );
    expect(checkFile(file)).toEqual([]);
  });

  it('does not read one-line namespaces named like CSS properties as properties', () => {
    const { checkFile } = loadChecker();
    const file = writeFixture(
      component(`{
  box: { display: 'flex' },
  left: { alignItems: 'center' },
  dark: { backgroundColor: 'red' },
  top: (offset: string) => ({ marginTop: offset }),
}`)
    );
    expect(checkFile(file)).toEqual([]);
  });

  it('accepts logical sizes the compiler emits as physical properties', () => {
    const { checkFile } = loadChecker();
    const file = writeFixture(
      component(`{
  box: { blockSize: 10, inlineSize: 20, minBlockSize: 4, maxInlineSize: '100%' },
}`)
    );
    expect(checkFile(file)).toEqual([]);
  });
});
