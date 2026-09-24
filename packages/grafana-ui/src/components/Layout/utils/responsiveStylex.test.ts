import { responsiveArgs, spacingValue } from './responsiveStylex';

describe('responsiveArgs', () => {
  it('puts a plain value in the base slot', () => {
    expect(responsiveArgs('row')).toEqual(['row', undefined, undefined, undefined, undefined, undefined, undefined]);
  });

  it('spreads a responsive object over the breakpoint slots', () => {
    expect(responsiveArgs({ xs: 'column', md: 'row' })).toEqual([
      undefined,
      'column',
      undefined,
      'row',
      undefined,
      undefined,
      undefined,
    ]);
  });

  it('maps values and skips missing ones', () => {
    expect(responsiveArgs<number, string>({ xs: 1, lg: 2 }, (v) => `${v}!`)).toEqual([
      undefined,
      '1!',
      undefined,
      undefined,
      '2!',
      undefined,
      undefined,
    ]);
    expect(responsiveArgs(undefined)).toEqual([
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    ]);
  });
});

describe('spacingValue', () => {
  it('scales the grid size token like theme.spacing()', () => {
    expect(spacingValue(1)).toBe('calc(var(--gf-spacing-grid-size) * 1)');
    expect(spacingValue(0.75)).toBe('calc(var(--gf-spacing-grid-size) * 0.75)');
    expect(spacingValue(0)).toBe('calc(var(--gf-spacing-grid-size) * 0)');
  });

  it('passes strings through like theme.spacing()', () => {
    expect(spacingValue('100%')).toBe('100%');
  });
});
