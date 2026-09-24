import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../../../core/stylex/spacing';

export const warningBadgesStyles = stylex.create({
  noticeList: {
    margin: 0,
        paddingLeft: themeSpacing(2),
  },
  noticeContainer: {
    display: 'flex',
        flexDirection: 'column',
        gap: themeSpacing(1),
        padding: themeSpacing(1),
  },
});
