import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../../core/stylex/spacing';

export const queryPatternsModalStyles = stylex.create({
  spacing: {
    marginBottom: themeSpacing(1),
  },
  modal: {
    width: '85vw',
        '@media (max-width: 768.95px)': {
            width: '100%',
          },
  },
});
