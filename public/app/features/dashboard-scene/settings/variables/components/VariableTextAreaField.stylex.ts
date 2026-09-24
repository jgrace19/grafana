import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../../core/stylex/spacing';

export const variableTextAreaFieldStyles = stylex.create({
  textarea: {
    whiteSpace: 'pre-wrap',
          minHeight: themeSpacing(4),
          height: 'auto',
          overflow: 'auto',
          padding: `${themeSpacing(0.75)} ${themeSpacing(1)}`,
          width: 'inherit',
    
          ['@media (max-width: 543.95px)']: {
            width: '100%',
          },
  },
});
