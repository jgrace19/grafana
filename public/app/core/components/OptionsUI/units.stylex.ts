import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../stylex/spacing';

export const unitsStyles = stylex.create({
  wrapper: {
    width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
  },
  first: {
    marginRight: themeSpacing(1),
        flexGrow: 2,
  },
});
