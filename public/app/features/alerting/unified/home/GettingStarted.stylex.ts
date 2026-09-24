import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../stylex/spacing';

export const gettingStartedStyles = stylex.create({
  ctaContainer: {
    padding: themeSpacing(2),
        display: 'flex',
        gap: themeSpacing(4),
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    
        [@media (max-width: 991.95px)]: {
          flexDirection: 'column',
        },
  },
  separator: {
    width: '1px',
        backgroundColor: grafanaTokens.colors_border_medium,
    
        [@media (max-width: 991.95px)]: {
          display: 'none',
        },
  },
});
