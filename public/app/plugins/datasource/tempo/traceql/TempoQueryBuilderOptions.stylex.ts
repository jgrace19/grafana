import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const tempoQueryBuilderOptionsStyles = stylex.create({
  options: {
    display: 'flex',
          width: '-webkit-fill-available',
          gap: themeSpacing(1),
          '> div': {
            width: 'auto',
          },
  },
});
