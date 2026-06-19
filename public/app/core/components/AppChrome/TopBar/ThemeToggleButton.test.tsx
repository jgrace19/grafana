import { render, screen } from 'test/test-utils';

import * as ui from '@grafana/ui';

import { changeTheme } from 'app/core/services/theme';

import { ThemeToggleButton } from './ThemeToggleButton';

jest.mock('app/core/services/theme', () => ({
  changeTheme: jest.fn(),
}));

describe('ThemeToggleButton', () => {
  beforeEach(() => {
    jest.spyOn(ui, 'useTheme2').mockReturnValue({ isDark: true } as ReturnType<typeof ui.useTheme2>);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders on homepage route', () => {
    render(<ThemeToggleButton />, { historyOptions: { initialEntries: ['/'] } });

    expect(
      screen.getByRole('button', {
        name: 'Theme is currently dark. Activate to switch to light theme.',
      })
    ).toBeInTheDocument();
  });

  it('does not render on non-home routes', () => {
    render(<ThemeToggleButton />, { historyOptions: { initialEntries: ['/dashboards'] } });

    expect(screen.queryByRole('button', { name: /theme is currently/i })).not.toBeInTheDocument();
  });

  it('switches to light theme when dark mode is active', async () => {
    const { user } = render(<ThemeToggleButton />, { historyOptions: { initialEntries: ['/'] } });

    await user.click(
      screen.getByRole('button', {
        name: 'Theme is currently dark. Activate to switch to light theme.',
      })
    );

    expect(changeTheme).toHaveBeenCalledWith('light', false);
  });

  it('switches to dark theme when light mode is active', async () => {
    jest.spyOn(ui, 'useTheme2').mockReturnValue({ isDark: false } as ReturnType<typeof ui.useTheme2>);

    const { user } = render(<ThemeToggleButton />, { historyOptions: { initialEntries: ['/'] } });

    await user.click(
      screen.getByRole('button', {
        name: 'Theme is currently light. Activate to switch to dark theme.',
      })
    );

    expect(changeTheme).toHaveBeenCalledWith('dark', false);
  });
});
