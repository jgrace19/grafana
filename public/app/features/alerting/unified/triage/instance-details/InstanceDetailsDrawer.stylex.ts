import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../stylex/spacing';

export const instanceDetailsDrawerStyles = stylex.create({
  container: {
    display: 'grid',
        gridTemplateColumns: 'max-content max-content max-content max-content',
        gap: themeSpacingShorthand(1, 2),
        alignItems: 'center',
        padding: themeSpacingShorthand(1, 0),
  },
});
