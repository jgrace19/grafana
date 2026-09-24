import { css } from '@emotion/css';

import { colorManipulator } from '@grafana/data';
import { useTheme2 } from '@grafana/ui';

/**
 * @deprecated Emotion compat: `Branding.LoginBoxBackground()` returns a class name, and `BrandingSettings.loginBoxBackground`
 * overrides it with one, so it keeps returning an Emotion class until that contract changes.
 */
export const LoginBoxBackground = () => {
  const theme = useTheme2();
  return css({
    background: colorManipulator.alpha(theme.colors.background.primary, 0.7),
    backgroundSize: 'cover',
  });
};
