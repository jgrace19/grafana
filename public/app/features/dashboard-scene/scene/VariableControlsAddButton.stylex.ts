import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../core/stylex/spacing';

export const variableControlsAddButtonStyles = stylex.create({
  addButton: {
    display: 'inline-flex',
        alignItems: 'center',
        verticalAlign: 'middle',
        marginBottom: themeSpacing(1),
        marginRight: themeSpacing(1),
  },
});
