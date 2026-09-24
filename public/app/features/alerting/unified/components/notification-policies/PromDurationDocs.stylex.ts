import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../stylex/spacing';

export const promDurationDocsStyles = stylex.create({
  unit: {
    fontWeight: grafanaTokens.typography_fontWeightBold,
  },
  list: {
    display: 'grid',
        gridTemplateColumns: 'max-content 1fr 2fr',
        gap: themeSpacingShorthand(1, 3),
  },
  header: {
    display: 'contents',
        fontWeight: grafanaTokens.typography_fontWeightBold,
  },
  examples: {
    display: 'contents',
        ' > div': {
          gridColumn: '1 / span 2',
        },
  },
});
