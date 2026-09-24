import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../stylex/spacing';

export const newsDrawerStyles = stylex.create({
  title: {
    display: `flex`,
          alignItems: `center`,
          justifyContent: `center`,
          gap: themeSpacing(2),
  },
  grot: {
    display: `flex`,
          alignItems: `center`,
          justifyContent: `center`,
          padding: themeSpacingShorthand(2, 0),
    
          img: {
            width: `75px`,
            height: `75px`,
          },
  },
});
