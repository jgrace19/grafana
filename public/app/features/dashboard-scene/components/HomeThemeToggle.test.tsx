import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { createTheme } from '@grafana/data';
import { mockThemeContext } from '@grafana/ui';

jest.mock('app/core/services/theme', () => ({
  changeTheme: jest.fn().mockResolvedValue(undefined),
}));

import { changeTheme } from 'app/core/services/theme';

import { HomeThemeToggle } from './HomeThemeToggle';

describe('HomeThemeToggle', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.mocked(changeTheme).mockClear();
  });

  describe('when current theme is dark', () => {
    let restoreThemeContext: () => void;

    beforeAll(() => {
      restoreThemeContext = mockThemeContext(createTheme({ colors: { mode: 'dark' } }));
    });

    afterAll(() => {
      restoreThemeContext();
    });

    it('switches to light theme when the toggle is activated', async () => {
      render(<HomeThemeToggle />);

      expect(screen.getByTestId('home-theme-toggle')).toBeInTheDocument();

      await user.click(screen.getByRole('switch'));

      expect(changeTheme).toHaveBeenCalledTimes(1);
      expect(changeTheme).toHaveBeenCalledWith('light', false);
    });
  });

  describe('when current theme is light', () => {
    let restoreThemeContext: () => void;

    beforeAll(() => {
      restoreThemeContext = mockThemeContext(createTheme({ colors: { mode: 'light' } }));
    });

    afterAll(() => {
      restoreThemeContext();
    });

    it('switches to dark theme when the toggle is activated', async () => {
      render(<HomeThemeToggle />);

      await user.click(screen.getByRole('switch'));

      expect(changeTheme).toHaveBeenCalledTimes(1);
      expect(changeTheme).toHaveBeenCalledWith('dark', false);
    });
  });
});
