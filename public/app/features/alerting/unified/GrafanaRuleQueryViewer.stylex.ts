import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from './stylex/spacing';

export const grafanaRuleQueryViewerStyles = stylex.create({
  maxWidthContainer: {
    maxWidth: '100%',
  },
  container: {
    display: 'flex',
          gap: themeSpacing(0.5),
  },
  blue: {
    margin: 'auto 0'
  },
  bold: {
    margin: 'auto 0'
  },
});
