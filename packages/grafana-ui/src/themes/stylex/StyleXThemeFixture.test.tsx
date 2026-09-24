import { css } from '@emotion/css';
import { render, screen } from '@testing-library/react';

import { getThemeById } from '@grafana/data';

import { StyleXThemeFixture } from '../../utils/storybook/fixtures/StyleXThemeFixture';

import { STYLEX_STYLE_ELEMENT_ATTRIBUTE } from './inject';
import { getCascadedStyle, getResolvedStyle, ThemeCssVariables } from './testUtils';

describe('StyleX foundation smoke test', () => {
  it('compiles StyleX and injects atomic rules into the StyleX sheet', () => {
    render(<StyleXThemeFixture />);

    const card = screen.getByTestId('stylex-theme-fixture');
    expect(card.className).toMatch(/^x[a-z0-9]+( x[a-z0-9]+)*$/);

    const sheet = document.head.querySelector<HTMLStyleElement>(`style[${STYLEX_STYLE_ELEMENT_ATTRIBUTE}]`)?.sheet;
    const cssText = Array.from(sheet?.cssRules ?? [])
      .map((rule) => rule.cssText)
      .join('\n');
    expect(cssText).toContain('var(--grafana-colors-background-secondary)');
  });

  it.each(['dark', 'light'])('resolves tokens against the %s theme', (themeId) => {
    const theme = getThemeById(themeId);
    render(
      <>
        <ThemeCssVariables theme={theme} />
        <StyleXThemeFixture />
      </>
    );

    const card = screen.getByTestId('stylex-theme-fixture');
    expect(getCascadedStyle(card, 'background-color')).toBe('var(--grafana-colors-background-secondary)');
    expect(getResolvedStyle(card, 'background-color')).toBe(theme.colors.background.secondary);
    expect(getResolvedStyle(card, 'color')).toBe(theme.colors.text.primary);
    expect(getResolvedStyle(card, 'border-color')).toBe(theme.colors.border.weak);
    expect(getResolvedStyle(card, 'border-radius')).toBe(theme.shape.radius.default);
    expect(getResolvedStyle(card, 'padding')).toBe(theme.spacing(2));
    expect(getResolvedStyle(screen.getByTestId('stylex-swatch-primary'), 'background-color')).toBe(
      theme.colors.primary.main
    );
    expect(getResolvedStyle(screen.getByTestId('stylex-theme-fixture-caption'), 'color')).toBe(
      theme.colors.text.secondary
    );
  });

  it('lets an Emotion className passed by a consumer override StyleX styles', () => {
    const override = css({ backgroundColor: 'rgb(1, 2, 3)' });
    render(
      <>
        <StyleXThemeFixture title="plain" />
        <StyleXThemeFixture title="overridden" className={override} />
      </>
    );
    const [plain, overridden] = screen.getAllByTestId('stylex-theme-fixture');

    expect(getCascadedStyle(plain, 'background-color')).toBe('var(--grafana-colors-background-secondary)');
    expect(overridden).toHaveClass(override);
    expect(getCascadedStyle(overridden, 'background-color')).toBe('rgb(1, 2, 3)');
    expect(getCascadedStyle(overridden, 'border-color')).toBe('var(--grafana-colors-border-weak)');
  });
});
