import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TestProvider } from 'test/helpers/TestProvider';

import * as themeService from 'app/core/services/theme';

import { HomeThemeToggle } from './HomeThemeToggle';

jest.mock('@grafana/runtime', () => ({
  ...jest.requireActual('@grafana/runtime'),
  useChromeHeaderHeight: jest.fn(() => 80),
}));

jest.mock('app/core/services/theme', () => ({
  ...jest.requireActual('app/core/services/theme'),
  toggleTheme: jest.fn(),
}));

describe('HomeThemeToggle', () => {
  it('calls toggleTheme when the dark mode switch is toggled', async () => {
    const user = userEvent.setup();
    render(
      <TestProvider>
        <HomeThemeToggle />
      </TestProvider>
    );

    await user.click(screen.getByRole('switch'));

    expect(themeService.toggleTheme).toHaveBeenCalledWith(false);
  });
});
