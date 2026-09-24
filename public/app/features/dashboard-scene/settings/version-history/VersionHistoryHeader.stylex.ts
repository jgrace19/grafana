import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const versionHistoryHeaderStyles = stylex.create({
  header: {
    fontSize: grafanaTokens.typography_h3_fontSize,
        display: 'flex',
        gap: themeSpacing(2),
        marginBottom: themeSpacing(2),
  },
});
