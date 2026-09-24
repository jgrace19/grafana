import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../../core/stylex/spacing';

export const rowActionsRendererStyles = stylex.create({
  rowActions: {
    color: grafanaTokens.colors_text_secondary,
          lineHeight: '27px',
    
          button: {
            color: grafanaTokens.colors_text_secondary,
            paddingLeft: themeSpacing(2),
            background: 'transparent',
            border: 'none',
    
            ':hover': {
              color: grafanaTokens.colors_text_maxContrast,
            },
          },
  },
});
