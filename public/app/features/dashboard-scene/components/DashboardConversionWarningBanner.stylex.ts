import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../core/stylex/spacing';

export const dashboardConversionWarningBannerStyles = stylex.create({
  linkButton: {
    marginTop: 0,
          marginLeft: 0,
          paddingLeft: 0,
          paddingRight: 0,
          fontSize: '1rem',
          verticalAlign: 'baseline',
          color: grafanaTokens.colors_text_link,
  },
  buttonContainer: {
    marginTop: themeSpacing(1),
  },
  expandedContent: {
    marginTop: themeSpacing(1),
  },
  detailsList: {
    marginTop: themeSpacing(1),
          marginBottom: themeSpacing(1),
          paddingLeft: themeSpacing(2.5),
  },
});
