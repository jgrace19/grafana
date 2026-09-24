import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../stylex/spacing';

export const layerDragDropListStyles = stylex.create({
  wrapper: {
    marginBottom: themeSpacing(2),
  },
  row: {
    padding: themeSpacingShorthand(0.5, 1),
        borderRadius: grafanaTokens.shape_radius_default,
        background: grafanaTokens.colors_background_secondary,
        minHeight: themeSpacing(4),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '3px',
        cursor: 'pointer',
    
        border: `1px solid ${theme.components.input.borderColor}`,
        ':hover': {
          border: `1px solid ${theme.components.input.borderHover}`,
        },
  },
  sel: {
    border: `1px solid ${grafanaTokens.colors_primary_border}`,
        ':hover': {
          border: `1px solid ${grafanaTokens.colors_primary_border}`,
        },
  },
  dragIcon: {
    cursor: 'drag',
  },
  actionIcon: {
    color: grafanaTokens.colors_text_secondary,
        ':hover': {
          color: grafanaTokens.colors_text_primary,
        },
  },
  typeWrapper: {
    color: grafanaTokens.colors_primary_text,
        marginRight: '5px',
  },
  textWrapper: {
    display: 'flex',
        alignItems: 'center',
        flexGrow: 1,
        overflow: 'hidden',
        marginRight: themeSpacing(1),
  },
});
