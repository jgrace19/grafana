import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { createTheme } from '@grafana/data';
import { reportInteraction } from '@grafana/runtime';
import { changeTheme } from 'app/core/services/theme';
import { ThemeProvider } from 'app/core/utils/ConfigProvider';

import { ThemeToggleButton, isHomePath } from './HomeThemeToggleButton';

jest.mock('app/core/services/theme', () => ({
  changeTheme: jest.fn(),
}));

jest.mock('@grafana/runtime', () => ({
  ...jest.requireActual('@grafana/runtime'),
  reportInteraction: jest.fn(),
}));

describe('ThemeToggleButton', () => {
  const setup = (mode: 'light' | 'dark') => {
    const user = userEvent.setup();

    render(
      <ThemeProvider value={createTheme({ colors: { mode } })}>
        <ThemeToggleButton />
      </ThemeProvider>
    );

    return { user };
  };

  beforeEach(() => {
    jest.mocked(changeTheme).mockClear();
    jest.mocked(reportInteraction).mockClear();
  });

  it('switches to light mode from a dark active theme', async () => {
    const { user } = setup('dark');

    const button = screen.getByRole('button', { name: 'Switch to light mode' });
    expect(button).toHaveAttribute('aria-pressed', 'true');

    await user.click(button);

    expect(changeTheme).toHaveBeenCalledWith('light', false);
    expect(reportInteraction).toHaveBeenCalledWith('grafana_homepage_theme_toggle_clicked', { toTheme: 'light' });
  });

  it('switches to dark mode from a light active theme', async () => {
    const { user } = setup('light');

    const button = screen.getByRole('button', { name: 'Switch to dark mode' });
    expect(button).toHaveAttribute('aria-pressed', 'false');

    await user.click(button);

    expect(changeTheme).toHaveBeenCalledWith('dark', false);
    expect(reportInteraction).toHaveBeenCalledWith('grafana_homepage_theme_toggle_clicked', { toTheme: 'dark' });
  });
});

describe('isHomePath', () => {
  it('returns true only for the root homepage path', () => {
    expect(isHomePath('/')).toBe(true);
    expect(isHomePath('')).toBe(true);
    expect(isHomePath('/d/dashboard-uid/dashboard-slug')).toBe(false);
  });
});
