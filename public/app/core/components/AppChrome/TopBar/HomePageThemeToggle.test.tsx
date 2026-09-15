import { screen } from '@testing-library/react';
import { render } from 'test/test-utils';

import { config } from '@grafana/runtime';

import { HomePageThemeToggle } from './HomePageThemeToggle';

jest.mock('app/core/services/theme', () => ({
  toggleTheme: jest.fn(),
}));

const mockToggleTheme = jest.requireMock('app/core/services/theme').toggleTheme as jest.Mock;

jest.mock('@grafana/ui', () => {
  const actual = jest.requireActual('@grafana/ui');
  return {
    ...actual,
    useTheme2: () => ({ isDark: false }),
  };
});

describe('HomePageThemeToggle', () => {
  let previousAppSubUrl: string;

  beforeEach(() => {
    previousAppSubUrl = config.appSubUrl;
    config.appSubUrl = '';
    mockToggleTheme.mockClear();
  });

  afterEach(() => {
    config.appSubUrl = previousAppSubUrl;
  });

  it('renders on the home route and calls toggleTheme on click', async () => {
    const { user } = render(<HomePageThemeToggle />, { historyOptions: { initialEntries: ['/'] } });

    const button = screen.getByRole('button', { name: /switch to dark mode/i });
    await user.click(button);

    expect(mockToggleTheme).toHaveBeenCalledWith(false);
  });

  it('does not render when not on the home route', () => {
    render(<HomePageThemeToggle />, { historyOptions: { initialEntries: ['/dashboard/new'] } });

    expect(screen.queryByRole('button', { name: /switch to (light|dark) mode/i })).not.toBeInTheDocument();
  });
});
