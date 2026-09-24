import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../core/stylex/spacing';

export const variableDescriptionTooltipStyles = stylex.create({
  icon: {
    color: grafanaTokens.colors_text_secondary,
  },
  tooltipContent: {
    maxWidth: themeSpacing(40),
        whiteSpace: 'normal',
        wordBreak: 'break-word',
  },
  link: {
    color: grafanaTokens.colors_primary_text,
        textDecoration: 'underline',
  },
});
