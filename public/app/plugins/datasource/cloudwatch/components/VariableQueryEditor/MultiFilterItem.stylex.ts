import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../../core/stylex/spacing';

export const multiFilterItemStyles = stylex.create({
  root: {
    padding: themeSpacingShorthand(0, 1),
        alignSelf: 'center',
  },
});
