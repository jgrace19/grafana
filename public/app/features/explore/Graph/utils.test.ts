import { store } from '@grafana/data';

import { loadGraphScale, loadGraphStyle, storeGraphScale, storeGraphStyle, toGraphScale, toGraphStyle } from './utils';

jest.mock('@grafana/data', () => ({
  ...jest.requireActual('@grafana/data'),
  store: {
    get: jest.fn(),
    set: jest.fn(),
  },
}));

describe('Graph utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('toGraphStyle', () => {
    it('should return valid graph style when given valid value', () => {
      expect(toGraphStyle('lines')).toBe('lines');
      expect(toGraphStyle('bars')).toBe('bars');
      expect(toGraphStyle('points')).toBe('points');
      expect(toGraphStyle('stacked_lines')).toBe('stacked_lines');
      expect(toGraphStyle('stacked_bars')).toBe('stacked_bars');
    });

    it('should return default graph style for invalid values', () => {
      expect(toGraphStyle('invalid')).toBe('lines');
      expect(toGraphStyle(null)).toBe('lines');
      expect(toGraphStyle(undefined)).toBe('lines');
      expect(toGraphStyle(123)).toBe('lines');
      expect(toGraphStyle({})).toBe('lines');
      expect(toGraphStyle([])).toBe('lines');
    });
  });

  describe('toGraphScale', () => {
    it('should return valid graph scale when given valid value', () => {
      expect(toGraphScale('linear')).toBe('linear');
      expect(toGraphScale('log')).toBe('log');
    });

    it('should return default graph scale for invalid values', () => {
      expect(toGraphScale('invalid')).toBe('linear');
      expect(toGraphScale(null)).toBe('linear');
      expect(toGraphScale(undefined)).toBe('linear');
      expect(toGraphScale(123)).toBe('linear');
      expect(toGraphScale({})).toBe('linear');
      expect(toGraphScale([])).toBe('linear');
    });
  });

  describe('storeGraphStyle', () => {
    it('should store graph style in local storage', () => {
      storeGraphStyle('bars');
      expect(store.set).toHaveBeenCalledWith('grafana.explore.style.graph', 'bars');
    });
  });

  describe('loadGraphStyle', () => {
    it('should load graph style from local storage', () => {
      (store.get as jest.Mock).mockReturnValue('bars');
      expect(loadGraphStyle()).toBe('bars');
      expect(store.get).toHaveBeenCalledWith('grafana.explore.style.graph');
    });

    it('should return default when storage returns invalid value', () => {
      (store.get as jest.Mock).mockReturnValue('invalid');
      expect(loadGraphStyle()).toBe('lines');
    });
  });

  describe('storeGraphScale', () => {
    it('should store graph scale in local storage', () => {
      storeGraphScale('log');
      expect(store.set).toHaveBeenCalledWith('grafana.explore.scale.graph', 'log');
    });
  });

  describe('loadGraphScale', () => {
    it('should load graph scale from local storage', () => {
      (store.get as jest.Mock).mockReturnValue('log');
      expect(loadGraphScale()).toBe('log');
      expect(store.get).toHaveBeenCalledWith('grafana.explore.scale.graph');
    });

    it('should return default when storage returns invalid value', () => {
      (store.get as jest.Mock).mockReturnValue('invalid');
      expect(loadGraphScale()).toBe('linear');
    });
  });
});
