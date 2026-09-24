import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../stylex/spacing';

export const signInLinkStyles = stylex.create({
  link: {
    paddingLeft: themeSpacing(1),
          paddingRight: themeSpacing(1),
          whiteSpace: 'nowrap',
          ':hover': {
            textDecoration: 'underline',
          },
  },
});
