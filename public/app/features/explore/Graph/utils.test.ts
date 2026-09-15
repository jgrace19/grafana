import { store } from '@grafana/data';

import { loadGraphScale, loadGraphStyle, storeGraphScale, storeGraphStyle, toGraphScale } from './utils';

const GRAPH_STYLE_KEY = 'grafana.explore.style.graph';
const GRAPH_SCALE_KEY = 'grafana.explore.style.scale';

afterEach(() => {
  store.delete(GRAPH_STYLE_KEY);
  store.delete(GRAPH_SCALE_KEY);
});

describe('graph style storage', () => {
  it('round-trips a known style', () => {
    storeGraphStyle('bars');
    expect(loadGraphStyle()).toBe('bars');
  });

  it('returns the default ("lines") when nothing is stored', () => {
    expect(loadGraphStyle()).toBe('lines');
  });

  it('returns the default ("lines") when the stored value is invalid', () => {
    store.set(GRAPH_STYLE_KEY, 'something-bogus');
    expect(loadGraphStyle()).toBe('lines');
  });
});

describe('graph scale storage', () => {
  it('round-trips a known scale', () => {
    storeGraphScale('log');
    expect(loadGraphScale()).toBe('log');
  });

  it('returns the default ("linear") when nothing is stored', () => {
    expect(loadGraphScale()).toBe('linear');
  });

  it('returns the default ("linear") when the stored value is invalid', () => {
    store.set(GRAPH_SCALE_KEY, 'symlog');
    expect(loadGraphScale()).toBe('linear');
  });
});

describe('toGraphScale', () => {
  it('accepts known string values', () => {
    expect(toGraphScale('linear')).toBe('linear');
    expect(toGraphScale('log')).toBe('log');
  });

  it('rejects garbage and returns the default', () => {
    expect(toGraphScale(null)).toBe('linear');
    expect(toGraphScale(undefined)).toBe('linear');
    expect(toGraphScale(42)).toBe('linear');
    expect(toGraphScale({})).toBe('linear');
    expect(toGraphScale('LINEAR')).toBe('linear');
    expect(toGraphScale('logarithmic')).toBe('linear');
  });
});
