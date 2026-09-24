import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const querySettingsStyles = stylex.create({
  infoText: {
    paddingBottom: themeSpacing(2),
        color: grafanaTokens.colors_text_secondary,
  },
  container: {
    width: '100%',
  },
  row: {
    alignItems: 'baseline',
  },
});
