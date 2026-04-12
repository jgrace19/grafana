import { screen } from '@testing-library/react';
import { render } from 'test/test-utils';

import { createTheme, type GrafanaTheme2 } from '@grafana/data';
import { reportInteraction } from '@grafana/runtime';
import { toggleTheme } from 'app/core/services/theme';

import { ThemeModeToggle } from './ThemeModeToggle';

const mockUseTheme2 = jest.fn<() => GrafanaTheme2, []>();

jest.mock('@grafana/ui', () => ({
  ...jest.requireActual('@grafana/ui'),
  useTheme2: () => mockUseTheme2(),
}));

jest.mock('app/core/services/theme', () => ({
  toggleTheme: jest.fn(),
}));

jest.mock('@grafana/runtime', () => ({
  ...jest.requireActual('@grafana/runtime'),
  reportInteraction: jest.fn(),
}));

describe('ThemeModeToggle', () => {
  const toggleThemeMock = toggleTheme as jest.MockedFunction<typeof toggleTheme>;
  const reportInteractionMock = reportInteraction as jest.MockedFunction<typeof reportInteraction>;

  beforeEach(() => {
    toggleThemeMock.mockClear();
    reportInteractionMock.mockClear();
    mockUseTheme2.mockReturnValue(createTheme({ colors: { mode: 'dark' } }));
  });

  it('switches to light when the current theme is dark', async () => {
    const { user } = render(<ThemeModeToggle />);

    await user.click(screen.getByRole('button', { name: /switch to light theme/i }));

    expect(reportInteractionMock).toHaveBeenCalledWith('grafana_preferences_theme_changed', {
      toTheme: 'light',
      preferenceType: 'top_bar_toggle',
    });
    expect(toggleThemeMock).toHaveBeenCalledWith(false);
  });

  it('switches to dark when the current theme is light', async () => {
    mockUseTheme2.mockReturnValue(createTheme({ colors: { mode: 'light' } }));

    const { user } = render(<ThemeModeToggle />);

    await user.click(screen.getByRole('button', { name: /switch to dark theme/i }));

    expect(reportInteractionMock).toHaveBeenCalledWith('grafana_preferences_theme_changed', {
      toTheme: 'dark',
      preferenceType: 'top_bar_toggle',
    });
    expect(toggleThemeMock).toHaveBeenCalledWith(false);
  });
});
