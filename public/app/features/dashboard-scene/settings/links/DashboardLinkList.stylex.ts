import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const dashboardLinkListStyles = stylex.create({
  titleWrapper: {
    width: '20vw',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
  },
  urlWrapper: {
    width: '40vw',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
  },
  newLinkButton: {
    marginTop: themeSpacing(3),
  },
});
