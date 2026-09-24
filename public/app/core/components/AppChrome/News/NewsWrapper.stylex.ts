import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../stylex/spacing';

export const newsWrapperStyles = stylex.create({
  innerWrapper: {
    width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
  },
  grot: {
    display: `flex`,
          alignItems: `center`,
          justifyContent: `center`,
          padding: themeSpacingShorthand(5, 0),
    
          img: {
            width: `186px`,
            height: `186px`,
          },
  },
});
