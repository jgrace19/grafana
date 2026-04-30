import { render, screen } from 'test/test-utils';

import { createTheme } from '@grafana/data';
import { reportInteraction } from '@grafana/runtime';
import { mockThemeContext } from '@grafana/ui';
import { changeTheme } from 'app/core/services/theme';

import { HomeThemeToggle } from './HomeThemeToggle';

jest.mock('@grafana/runtime', () => ({
  ...jest.requireActual('@grafana/runtime'),
  reportInteraction: jest.fn(),
}));

jest.mock('app/core/services/theme', () => ({
  changeTheme: jest.fn(),
}));

describe('HomeThemeToggle', () => {
  let restoreThemeContext: () => void;

  afterEach(() => {
    restoreThemeContext?.();
    jest.clearAllMocks();
  });

  it('switches from dark to light mode', async () => {
    restoreThemeContext = mockThemeContext(createTheme({ colors: { mode: 'dark' } }));
    const { user } = render(<HomeThemeToggle />);

    await user.click(screen.getByRole('button', { name: 'Switch to light mode' }));

    expect(reportInteraction).toHaveBeenCalledWith('grafana_preferences_theme_changed', {
      toTheme: 'light',
      preferenceType: 'home_page_toggle',
    });
    expect(changeTheme).toHaveBeenCalledWith('light', false);
  });

  it('switches from light to dark mode', async () => {
    restoreThemeContext = mockThemeContext(createTheme({ colors: { mode: 'light' } }));
    const { user } = render(<HomeThemeToggle />);

    await user.click(screen.getByRole('button', { name: 'Switch to dark mode' }));

    expect(reportInteraction).toHaveBeenCalledWith('grafana_preferences_theme_changed', {
      toTheme: 'dark',
      preferenceType: 'home_page_toggle',
    });
    expect(changeTheme).toHaveBeenCalledWith('dark', false);
  });
});
