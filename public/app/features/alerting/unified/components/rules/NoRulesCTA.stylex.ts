import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../stylex/spacing';

export const noRulesCTAStyles = stylex.create({
  container: {
    display: 'flex',
        gap: themeSpacing(1),
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: themeSpacingShorthand(2, 1),
  },
});
