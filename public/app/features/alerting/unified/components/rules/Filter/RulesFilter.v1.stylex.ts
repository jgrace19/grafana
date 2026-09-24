import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../stylex/spacing';

export const rulesFilter.v1Styles = stylex.create({
  grid: {
    display: 'grid',
        gridTemplateColumns: 'max-content auto',
        gap: themeSpacing(1),
        alignItems: 'center',
  },
  code: {
    display: 'block',
        textAlign: 'center',
  },
});
