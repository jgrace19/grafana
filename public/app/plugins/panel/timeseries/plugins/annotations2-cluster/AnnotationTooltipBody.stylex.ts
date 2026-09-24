import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../../core/stylex/spacing';

export const annotationTooltipBodyStyles = stylex.create({
  body: {
    padding: themeSpacing(1),
        fontSize: grafanaTokens.typography_bodySmall_fontSize,
        color: grafanaTokens.colors_text_secondary,
        fontWeight: 400,
        a: {
          color: grafanaTokens.colors_text_link,
          ':hover': {
            textDecoration: 'underline',
          },
        },
  },
  text: {
    paddingBottom: themeSpacing(1),
  },
});
