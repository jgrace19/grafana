import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacingShorthand } from '../../../stylex/spacing';

export const singleTopBarActionsStyles = stylex.create({
  actionsBar: {
    alignItems: 'center',
    backgroundColor: grafanaTokens.colors_background_primary,
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: grafanaTokens.colors_border_weak,
    display: 'flex',
    padding: themeSpacingShorthand(0, 1, 0, 2),
  },
});
