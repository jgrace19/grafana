import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from 'test/test-utils';

import { createTheme } from '@grafana/data';
import { mockThemeContext } from '@grafana/ui';
import { changeTheme } from 'app/core/services/theme';

import { ThemeToggleButton } from './ThemeToggleButton';

jest.mock('app/core/services/theme', () => ({
  changeTheme: jest.fn(),
}));

describe('ThemeToggleButton', () => {
  let restoreThemeContext: (() => void) | undefined;

  afterEach(() => {
    restoreThemeContext?.();
    restoreThemeContext = undefined;
    jest.clearAllMocks();
  });

  it('switches from dark mode to an explicit light preference', async () => {
    restoreThemeContext = mockThemeContext(createTheme({ colors: { mode: 'dark' } }));
    render(<ThemeToggleButton />);

    const button = screen.getByRole('button', { name: 'Switch to light theme' });
    expect(button).toHaveAttribute('aria-pressed', 'true');

    await userEvent.click(button);

    expect(changeTheme).toHaveBeenCalledWith('light', false);
  });

  it('switches from light mode to an explicit dark preference', async () => {
    restoreThemeContext = mockThemeContext(createTheme({ colors: { mode: 'light' } }));
    render(<ThemeToggleButton />);

    const button = screen.getByRole('button', { name: 'Switch to dark theme' });
    expect(button).toHaveAttribute('aria-pressed', 'false');

    await userEvent.click(button);

    expect(changeTheme).toHaveBeenCalledWith('dark', false);
  });
});
