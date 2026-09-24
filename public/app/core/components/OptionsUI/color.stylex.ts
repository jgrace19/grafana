import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../stylex/spacing';

export const colorStyles = stylex.create({
  spot: {
    cursor: 'pointer',
          color: grafanaTokens.colors_text_primary,
          background: theme.components.input.background,
          borderRadius: grafanaTokens.shape_radius_default,
          padding: '3px',
          height: theme.v1.spacing.formInputHeight,
          border: `1px solid ${theme.components.input.borderColor}`,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          alignContent: 'flex-end',
          ':hover': {
            border: `1px solid ${theme.components.input.borderHover}`,
          },
  },
  colorPicker: {
    padding: `0 ${themeSpacing(1)}`,
  },
  colorText: {
    flexGrow: 2,
  },
  placeholderText: {
    flexGrow: 2,
          color: grafanaTokens.colors_text_secondary,
  },
});
