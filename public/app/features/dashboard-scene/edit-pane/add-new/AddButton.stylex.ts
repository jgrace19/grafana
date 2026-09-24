import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const addButtonStyles = stylex.create({
  iconButton: {
    display: 'flex',
          padding: themeSpacing(1.5),
          gap: themeSpacing(1.5),
          alignItems: 'center',
          fontSize: '14px',
          ':hover': {
            background: grafanaTokens.colors_background_elevated,
            boxShadow: grafanaTokens.shadows_z1,
          },
  },
});
