import { toGraphScale, toGraphStyle } from './utils';

describe('explore graph style and scale utils', () => {
  describe('toGraphStyle', () => {
    it('returns graph style when value is valid', () => {
      expect(toGraphStyle('bars')).toBe('bars');
    });

    it('falls back to lines when value is invalid', () => {
      expect(toGraphStyle('invalid')).toBe('lines');
    });
  });

  describe('toGraphScale', () => {
    it('returns graph scale when value is valid', () => {
      expect(toGraphScale('log')).toBe('log');
    });

    it('falls back to linear when value is invalid', () => {
      expect(toGraphScale('invalid')).toBe('linear');
    });
  });
});
