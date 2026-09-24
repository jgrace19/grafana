import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';
import tinycolor from 'tinycolor2';

import { getThemeById, ThemeContext } from '@grafana/data';

import {
  appendConsumerStyles,
  getCascadedStyle,
  getResolvedStyle,
  ThemeCssVariables,
} from '../../themes/stylex/testUtils';

import { Badge, type BadgeColor } from './Badge';

const PALETTE_COLORS: Array<Exclude<BadgeColor, 'brand'>> = ['blue', 'red', 'green', 'orange', 'purple', 'darkgrey'];

describe('Badge', () => {
  it('renders the text and icon', () => {
    render(<Badge text="Badge label" color="blue" icon="rocket" />);

    const badge = screen.getByText('Badge label');
    expect(badge).toBeInTheDocument();
    expect(badge.querySelector('svg')).toBeInTheDocument();
  });

  it('passes through HTML attributes', () => {
    render(<Badge text="Label" color="green" data-testid="badge" aria-label="Status" />);
    expect(screen.getByTestId('badge')).toHaveAttribute('aria-label', 'Status');
  });

  it('shows the tooltip on hover', async () => {
    render(<Badge text="Hover me" color="blue" tooltip="Badge tooltip" />);

    await userEvent.hover(screen.getByText('Hover me'));
    expect(await screen.findByText('Badge tooltip')).toBeInTheDocument();
  });

  describe('styles', () => {
    it.each(['dark', 'light'])('applies layout and typography tokens in the %s theme', (themeId) => {
      const theme = getThemeById(themeId);
      render(
        <>
          <ThemeCssVariables theme={theme} />
          <Badge text="Label" color="blue" />
        </>
      );

      const badge = screen.getByText('Label');
      expect(getCascadedStyle(badge, 'display')).toBe('inline-flex');
      expect(getCascadedStyle(badge, 'align-items')).toBe('center');
      expect(getCascadedStyle(badge, 'padding-block')).toBe('1px');
      expect(getCascadedStyle(badge, 'padding-inline')).toBe('4px');
      expect(getCascadedStyle(badge, 'border-width')).toBe('1px');
      expect(getCascadedStyle(badge, 'border-style')).toBe('solid');
      expect(getResolvedStyle(badge, 'border-radius')).toBe(theme.shape.radius.sm);
      expect(getResolvedStyle(badge, 'gap')).toBe(theme.spacing(0.5));
      expect(getResolvedStyle(badge, 'font-weight')).toBe(String(theme.typography.fontWeightRegular));
      expect(getResolvedStyle(badge, 'font-size')).toBe(theme.typography.bodySmall.fontSize);
      expect(getResolvedStyle(badge, 'line-height')).toBe(String(theme.typography.bodySmall.lineHeight));
    });

    describe.each(['dark', 'light'])('%s theme palette', (themeId) => {
      const theme = getThemeById(themeId);
      const renderWithTheme = (ui: ReactElement) =>
        render(
          <ThemeContext.Provider value={theme}>
            <ThemeCssVariables theme={theme} />
            {ui}
          </ThemeContext.Provider>
        );

      it.each(PALETTE_COLORS)('derives %s colors from the visualization palette', (color) => {
        renderWithTheme(<Badge text={color} color={color} />);

        const source = theme.visualization.getColorByName(color);
        const expectedText = theme.isDark ? tinycolor(source).lighten(15) : tinycolor(source).darken(25);
        const badge = screen.getByText(color);
        expect(getResolvedStyle(badge, 'background-color')).toBe(tinycolor(source).setAlpha(0.15).toString());
        expect(getResolvedStyle(badge, 'border-color')).toBe(tinycolor(source).setAlpha(0.25).toString());
        expect(getResolvedStyle(badge, 'color')).toBe(expectedText.toString());
      });

      it('uses the brand gradient for the brand color', () => {
        renderWithTheme(<Badge text="Brand" color="brand" />);

        const badge = screen.getByText('Brand');
        expect(getResolvedStyle(badge, 'background-image')).toBe(theme.colors.gradients.brandHorizontal);
        expect(getCascadedStyle(badge, 'border-color')).toBe('transparent');
        expect(getResolvedStyle(badge, 'color')).toBe(theme.colors.primary.contrastText);
      });
    });

    it('lets consumer className and style override the defaults', () => {
      appendConsumerStyles('.consumer-badge { border-color: rgb(1, 2, 3); }');
      render(<Badge text="Custom" color="red" className="consumer-badge" style={{ marginLeft: '4px' }} />);

      const badge = screen.getByText('Custom');
      expect(badge).toHaveClass('consumer-badge');
      expect(getCascadedStyle(badge, 'border-color')).toBe('rgb(1, 2, 3)');
      expect(badge).toHaveStyle({ marginLeft: '4px' });
    });
  });
});
