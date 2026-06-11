import { config } from '@grafana/runtime';

import { getSelectableThemes } from './getSelectableThemes';

describe('getSelectableThemes', () => {
  let originalColorblindThemes: boolean | undefined;
  let originalGrafanaconThemes: boolean | undefined;

  beforeEach(() => {
    originalColorblindThemes = config.featureToggles.colorblindThemes;
    originalGrafanaconThemes = config.featureToggles.grafanaconThemes;
  });

  afterEach(() => {
    config.featureToggles.colorblindThemes = originalColorblindThemes;
    config.featureToggles.grafanaconThemes = originalGrafanaconThemes;
  });

  it('includes purple even when experimental toggles are disabled', () => {
    config.featureToggles.colorblindThemes = false;
    config.featureToggles.grafanaconThemes = false;

    const themeIds = getSelectableThemes().map((theme) => theme.id);

    expect(themeIds).toContain('purple');
  });

  it('does not mark purple as an experimental theme', () => {
    const purpleTheme = getSelectableThemes().find((theme) => theme.id === 'purple');

    expect(purpleTheme).toBeDefined();
    expect(purpleTheme?.isExtra).toBeUndefined();
  });
});
