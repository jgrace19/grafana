import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TestProvider } from 'test/helpers/TestProvider';

import * as themeService from 'app/core/services/theme';

import { HomeThemeToggle } from './HomeThemeToggle';

jest.mock('app/core/services/theme', () => ({
  ...jest.requireActual('app/core/services/theme'),
  toggleTheme: jest.fn(),
}));

describe('HomeThemeToggle', () => {
  it('calls toggleTheme when clicked', async () => {
    const user = userEvent.setup();
    render(
      <TestProvider>
        <HomeThemeToggle />
      </TestProvider>
    );

    await user.click(screen.getByTestId('home-theme-toggle').querySelector('button')!);

    expect(themeService.toggleTheme).toHaveBeenCalledWith(false);
  });
});
