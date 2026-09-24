import { mergeStylexProps } from './mergeStylexProps';

describe('mergeStylexProps', () => {
  it('appends the consumer className after the StyleX classes', () => {
    expect(mergeStylexProps({ className: 'x1 x2' }, { className: 'consumer' }).className).toBe('x1 x2 consumer');
  });

  it('omits className when there is none', () => {
    expect(mergeStylexProps({}, {}).className).toBeUndefined();
  });

  it('lets consumer style win over StyleX dynamic styles', () => {
    const merged = mergeStylexProps({ style: { width: 1, height: 2 } }, { style: { width: 3 } });
    expect(merged.style).toEqual({ width: 3, height: 2 });
  });

  it('keeps the StyleX style object when there is no consumer style', () => {
    const style = { width: 1 };
    expect(mergeStylexProps({ style }, {}).style).toBe(style);
  });
});
