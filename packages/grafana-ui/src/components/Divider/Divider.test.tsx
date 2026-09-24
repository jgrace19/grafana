import { render, screen } from '@testing-library/react';

import { createTheme, getThemeById } from '@grafana/data';

import { getCascadedStyle, getResolvedStyle, ThemeCssVariables } from '../../themes/stylex/testUtils';

import { Divider } from './Divider';

describe('Divider', () => {
  it('renders a horizontal rule by default', () => {
    render(<Divider />);
    expect(screen.getByRole('separator').tagName).toBe('HR');
  });

  it('renders a div for the vertical direction', () => {
    const { container } = render(<Divider direction="vertical" />);
    expect(screen.queryByRole('separator')).not.toBeInTheDocument();
    expect(container.firstElementChild?.tagName).toBe('DIV');
  });

  describe('styles', () => {
    it.each(['dark', 'light'])('draws a weak top border with default spacing in the %s theme', (themeId) => {
      const theme = getThemeById(themeId);
      render(
        <>
          <ThemeCssVariables theme={theme} />
          <Divider />
        </>
      );

      const divider = screen.getByRole('separator');
      expect(getCascadedStyle(divider, 'border-top-width')).toBe('1px');
      expect(getCascadedStyle(divider, 'border-top-style')).toBe('solid');
      expect(getResolvedStyle(divider, 'border-top-color')).toBe(theme.colors.border.weak);
      expect(getResolvedStyle(divider, 'margin-top')).toBe(theme.spacing(2));
      expect(getResolvedStyle(divider, 'margin-bottom')).toBe(theme.spacing(2));
      expect(getCascadedStyle(divider, 'margin-left')).toBe('0');
      expect(getCascadedStyle(divider, 'margin-right')).toBe('0');
      expect(getCascadedStyle(divider, 'width')).toBe('100%');
    });

    it.each(['dark', 'light'])('draws a weak right border with horizontal margins in the %s theme', (themeId) => {
      const theme = getThemeById(themeId);
      const { container } = render(
        <>
          <ThemeCssVariables theme={theme} />
          <Divider direction="vertical" spacing={1} />
        </>
      );

      const divider = container.querySelector('div')!;
      expect(getCascadedStyle(divider, 'border-right-width')).toBe('1px');
      expect(getCascadedStyle(divider, 'border-right-style')).toBe('solid');
      expect(getResolvedStyle(divider, 'border-right-color')).toBe(theme.colors.border.weak);
      expect(getResolvedStyle(divider, 'margin-left')).toBe(theme.spacing(1));
      expect(getResolvedStyle(divider, 'margin-right')).toBe(theme.spacing(1));
      expect(getCascadedStyle(divider, 'margin-top')).toBe('0');
      expect(getCascadedStyle(divider, 'height')).toBe('100%');
    });

    it.each([0, 0.5, 4, 10] as const)('maps spacing={%s} to theme.spacing', (spacing) => {
      const theme = createTheme({ spacing: { gridSize: 4 } });
      render(
        <>
          <ThemeCssVariables theme={theme} />
          <Divider spacing={spacing} />
        </>
      );

      expect(getResolvedStyle(screen.getByRole('separator'), 'margin-top')).toBe(theme.spacing(spacing));
    });
  });
});
