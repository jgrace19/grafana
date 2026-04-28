import { render, screen, userEvent } from 'test/test-utils';

import { config } from '@grafana/runtime';
import { changeTheme } from 'app/core/services/theme';

import { HomeThemeToggleButton, isHomePath } from './HomeThemeToggleButton';

jest.mock('app/core/services/theme', () => ({
  changeTheme: jest.fn().mockResolvedValue(undefined),
}));

describe('HomeThemeToggleButton', () => {
  const mockedChangeTheme = jest.mocked(changeTheme);

  beforeEach(() => {
    jest.clearAllMocks();
    config.appSubUrl = '';
  });

  describe('isHomePath', () => {
    it('matches root path when no sub url', () => {
      expect(isHomePath('/')).toBe(true);
    });

    it('does not match other paths', () => {
      expect(isHomePath('/explore')).toBe(false);
      expect(isHomePath('/d/abc')).toBe(false);
    });

    it('matches home when app lives under a sub path', () => {
      config.appSubUrl = '/grafana';
      expect(isHomePath('/grafana/')).toBe(true);
      expect(isHomePath('/grafana')).toBe(true);
    });
  });

  describe('interaction', () => {
    it('renders nothing when not on the home route', () => {
      const { container } = render(<HomeThemeToggleButton />, {
        historyOptions: { initialEntries: ['/explore'] },
      });

      expect(container.firstChild).toBeNull();
    });

    it('calls changeTheme to switch to light when dark mode is turned off', async () => {
      const user = userEvent.setup();
      render(<HomeThemeToggleButton />, {
        historyOptions: { initialEntries: ['/'] },
      });

      const toggle = screen.getByRole('switch', { name: /dark mode/i });
      await user.click(toggle);

      expect(mockedChangeTheme).toHaveBeenCalledWith('light', false);
    });
  });
});
