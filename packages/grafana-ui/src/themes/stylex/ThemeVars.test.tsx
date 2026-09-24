import { render } from '@testing-library/react';

import { createTheme, ThemeContext } from '@grafana/data';

import { GlobalStyles } from '../GlobalStyles/GlobalStyles';

import { ScopedThemeVars } from './ThemeVars';

describe('GlobalStyles theme vars', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('style');
  });

  it('writes the active theme onto <html> and follows theme changes without a reload', () => {
    const dark = createTheme();
    const light = createTheme({ colors: { mode: 'light' } });
    const rootStyle = document.documentElement.style;

    const { rerender } = render(
      <ThemeContext.Provider value={dark}>
        <GlobalStyles />
      </ThemeContext.Provider>
    );
    expect(rootStyle.getPropertyValue('--gf-colors-background-canvas')).toBe(dark.colors.background.canvas);

    rerender(
      <ThemeContext.Provider value={light}>
        <GlobalStyles />
      </ThemeContext.Provider>
    );
    expect(rootStyle.getPropertyValue('--gf-colors-background-canvas')).toBe(light.colors.background.canvas);
  });
});

describe('ScopedThemeVars', () => {
  it('scopes the theme vars to a box-less wrapper', () => {
    const light = createTheme({ colors: { mode: 'light' } });
    const { container } = render(
      <ScopedThemeVars theme={light}>
        <span>content</span>
      </ScopedThemeVars>
    );
    const wrapper = container.firstElementChild as HTMLElement;

    expect(wrapper.style.display).toBe('contents');
    expect(wrapper.style.getPropertyValue('--gf-colors-text-primary')).toBe(light.colors.text.primary);
  });
});
