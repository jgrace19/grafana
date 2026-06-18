import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from 'test/test-utils';

import { config } from '@grafana/runtime';

import { HomeThemeToggle } from './HomeThemeToggle';

const changeTheme = jest.fn();

jest.mock('app/core/services/theme', () => ({
  changeTheme: (...args: unknown[]) => changeTheme(...args),
}));

describe('HomeThemeToggle', () => {
  beforeEach(() => {
    changeTheme.mockClear();
  });

  it('calls changeTheme with the non-active color scheme', async () => {
    const user = userEvent.setup();
    render(<HomeThemeToggle />);

    const themeMode = config.theme2.colors.mode;
    const targetLabel = themeMode === 'dark' ? 'Light' : 'Dark';
    const expectedTheme = themeMode === 'dark' ? 'light' : 'dark';

    await user.click(screen.getByRole('radio', { name: targetLabel }));

    expect(changeTheme).toHaveBeenCalledWith(expectedTheme);
  });
});
