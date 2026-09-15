import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from 'test/test-utils';

import { config } from '@grafana/runtime';

import { ProfileButton } from './ProfileButton';

describe('ProfileButton theme menu visibility', () => {
  const defaultProps = {
    profileNode: {
      id: 'profile',
      text: 'Test User',
      url: '/profile',
      children: [],
    },
    onToggleKioskMode: jest.fn(),
  };

  it('shows change theme menu item even when grafanacon themes toggle is disabled', async () => {
    const user = userEvent.setup();
    const originalGrafanaconThemes = config.featureToggles.grafanaconThemes;
    const originalNewsFeedEnabled = config.newsFeedEnabled;

    config.featureToggles.grafanaconThemes = false;
    config.newsFeedEnabled = false;

    render(<ProfileButton {...defaultProps} />);

    await user.click(screen.getByRole('button', { name: /profile/i }));

    expect(screen.getByRole('menuitem', { name: /change theme/i })).toBeInTheDocument();

    config.featureToggles.grafanaconThemes = originalGrafanaconThemes;
    config.newsFeedEnabled = originalNewsFeedEnabled;
  });
});
