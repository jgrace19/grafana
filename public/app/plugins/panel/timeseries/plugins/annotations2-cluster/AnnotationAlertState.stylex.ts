import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../../core/stylex/spacing';

export const annotationAlertStateStyles = stylex.create({
  alertState: {
    paddingRight: themeSpacing(1),
        fontWeight: grafanaTokens.typography_fontWeightMedium,
  },
});
