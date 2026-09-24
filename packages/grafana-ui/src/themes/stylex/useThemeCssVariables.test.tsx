import { render } from '@testing-library/react';

import { getThemeById, type GrafanaTheme2 } from '@grafana/data';

import { THEME_VARIABLES_ELEMENT_ATTRIBUTE, useThemeCssVariables } from './useThemeCssVariables';

const Bridge = ({ theme }: { theme: GrafanaTheme2 }) => {
  useThemeCssVariables(theme);
  return null;
};

const getElements = () => document.head.querySelectorAll(`style[${THEME_VARIABLES_ELEMENT_ATTRIBUTE}]`);
const bodyVar = (name: string) => getComputedStyle(document.body).getPropertyValue(name).trim();

describe('useThemeCssVariables', () => {
  const dark = getThemeById('dark');
  const light = getThemeById('light');

  it('publishes theme variables on body and follows theme changes', () => {
    const { rerender, unmount } = render(<Bridge theme={dark} />);
    expect(getElements()).toHaveLength(1);
    expect(bodyVar('--grafana-colors-background-primary')).toBe(dark.colors.background.primary);

    rerender(<Bridge theme={light} />);
    expect(getElements()).toHaveLength(1);
    expect(bodyVar('--grafana-colors-background-primary')).toBe(light.colors.background.primary);

    unmount();
    expect(getElements()).toHaveLength(0);
  });

  it('restores the outer theme when a later provider unmounts', () => {
    const { unmount: unmountOuter } = render(<Bridge theme={dark} />);
    const { unmount: unmountInner } = render(<Bridge theme={light} />);
    expect(bodyVar('--grafana-colors-text-primary')).toBe(light.colors.text.primary);

    unmountInner();
    expect(bodyVar('--grafana-colors-text-primary')).toBe(dark.colors.text.primary);

    unmountOuter();
    expect(getElements()).toHaveLength(0);
  });
});
