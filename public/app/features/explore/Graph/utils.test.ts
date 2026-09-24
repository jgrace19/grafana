import { EXPLORE_GRAPH_STYLES } from 'app/types/explore';

import { loadGraphStyle, storeGraphStyle, toGraphStyle } from './utils';

const GRAPH_STYLE_KEY = 'grafana.explore.style.graph';

describe('toGraphStyle', () => {
  it.each(EXPLORE_GRAPH_STYLES)('accepts %s', (style) => {
    expect(toGraphStyle(style)).toBe(style);
  });

  it.each([undefined, null, '', 'area', 'LINES', 1, true, {}, ['bars'], { style: 'bars' }])(
    'falls back to lines for %p',
    (value) => {
      expect(toGraphStyle(value)).toBe('lines');
    }
  );
});

describe('storeGraphStyle / loadGraphStyle', () => {
  afterEach(() => {
    window.localStorage.clear();
  });

  it('round-trips a stored graph style', () => {
    storeGraphStyle('stacked_bars');

    expect(window.localStorage.getItem(GRAPH_STYLE_KEY)).toBe('stacked_bars');
    expect(loadGraphStyle()).toBe('stacked_bars');
  });

  it('defaults to lines when nothing is stored', () => {
    expect(loadGraphStyle()).toBe('lines');
  });

  it('defaults to lines when the stored value is invalid', () => {
    window.localStorage.setItem(GRAPH_STYLE_KEY, 'not-a-style');

    expect(loadGraphStyle()).toBe('lines');
  });
});
