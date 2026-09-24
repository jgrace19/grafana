import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../../core/stylex/spacing';

export const inlineEditBodyStyles = stylex.create({
  selectElement: {
    color: grafanaTokens.colors_text_secondary,
        padding: themeSpacing(2),
  },
});
