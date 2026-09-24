import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../core/stylex/spacing';

export const provisionedControlsSectionStyles = stylex.create({
  container: {
    marginTop: themeSpacing(3),
  },
  table: {
    width: '100%',
  },
  thNarrow: {
    width: '1%',
  },
  iconMuted: {
    color: grafanaTokens.colors_text_secondary,
  },
});
