import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../stylex/spacing';

export const loginPageStyles = stylex.create({
  forgottenPassword: {
    padding: 0,
          marginTop: themeSpacing(0.5),
  },
  alert: {
    width: '100%',
  },
});
