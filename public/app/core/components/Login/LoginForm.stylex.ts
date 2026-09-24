import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../stylex/spacing';

export const loginFormStyles = stylex.create({
  wrapper: {
    width: '100%',
          paddingBottom: themeSpacing(2),
  },
  submitButton: {
    justifyContent: 'center',
          width: '100%',
  },
  skipButton: {
    alignSelf: 'flex-start',
  },
});
