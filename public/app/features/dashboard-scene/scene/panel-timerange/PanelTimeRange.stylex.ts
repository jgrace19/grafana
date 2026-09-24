import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const panelTimeRangeStyles = stylex.create({
  timeshift: {
    color: grafanaTokens.colors_text_link,
          gap: themeSpacing(0.5),
          whiteSpace: 'nowrap',
  },
});
