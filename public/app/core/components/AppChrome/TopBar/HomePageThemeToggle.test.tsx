import { render, screen } from 'test/test-utils';

import { config, reportInteraction } from '@grafana/runtime';
import { toggleTheme } from 'app/core/services/theme';

import { HomePageThemeToggle } from './HomePageThemeToggle';

jest.mock('app/core/services/theme', () => ({
  ...jest.requireActual('app/core/services/theme'),
  toggleTheme: jest.fn(),
}));

jest.mock('@grafana/runtime', () => ({
  ...jest.requireActual('@grafana/runtime'),
  reportInteraction: jest.fn(),
}));

const mockedToggleTheme = jest.mocked(toggleTheme);
const mockedReportInteraction = jest.mocked(reportInteraction);

describe('HomePageThemeToggle', () => {
  const originalAppSubUrl = config.appSubUrl;

  beforeEach(() => {
    config.appSubUrl = '';
    mockedToggleTheme.mockResolvedValue();
  });

  afterEach(() => {
    config.appSubUrl = originalAppSubUrl;
    jest.clearAllMocks();
  });

  it('renders on the home route', () => {
    render(<HomePageThemeToggle />, { historyOptions: { initialEntries: ['/'] } });

    expect(screen.getByRole('button', { name: /switch to (light|dark) mode/i })).toBeInTheDocument();
  });

  it('does not render outside the home route', () => {
    render(<HomePageThemeToggle />, { historyOptions: { initialEntries: ['/dashboards'] } });

    expect(screen.queryByRole('button', { name: /switch to (light|dark) mode/i })).not.toBeInTheDocument();
  });

  it('renders when Grafana runs from appSubUrl with a trailing slash', () => {
    config.appSubUrl = '/grafana';

    render(<HomePageThemeToggle />, { historyOptions: { initialEntries: ['/grafana/'] } });

    expect(screen.getByRole('button', { name: /switch to (light|dark) mode/i })).toBeInTheDocument();
  });

  it('toggles theme and reports interaction on click', async () => {
    const { user } = render(<HomePageThemeToggle />, { historyOptions: { initialEntries: ['/'] } });

    await user.click(screen.getByRole('button', { name: /switch to (light|dark) mode/i }));

    expect(mockedReportInteraction).toHaveBeenCalledWith(
      'grafana_home_theme_toggle',
      expect.objectContaining({ toTheme: expect.any(String) })
    );
    expect(mockedToggleTheme).toHaveBeenCalledWith(false);
  });
});
