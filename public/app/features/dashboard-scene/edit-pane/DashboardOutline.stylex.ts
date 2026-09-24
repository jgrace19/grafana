import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../core/stylex/spacing';

export const dashboardOutlineStyles = stylex.create({
  container: {
    display: 'flex',
          gap: themeSpacing(0.5),
          flexGrow: 1,
          flexDirection: 'column',
          borderRadius: grafanaTokens.shape_radius_default,
          color: grafanaTokens.colors_text_secondary,
  },
  containerSelected: {
    outline: `1px dashed ${grafanaTokens.colors_primary_border} !important`,
          outlineOffset: '0px',
          color: grafanaTokens.colors_text_primary,
  },
  row: {
    display: 'flex',
          gap: themeSpacing(0.5),
          borderRadius: grafanaTokens.shape_radius_default,
  },
  rowEditMode: {
    ':hover': {
            color: grafanaTokens.colors_text_primary,
            outline: `1px dashed ${grafanaTokens.colors_border_strong}`,
            backgroundColor: grafanaTokens.colors_text_primary(grafanaTokens.colors_background_primary, 0.05),
          },
  },
  rowViewMode: {
    ':hover': {
            textDecoration: 'underline',
          },
  },
  rowSelected: {
    color: grafanaTokens.colors_text_primary,
          outline: `1px dashed ${grafanaTokens.colors_primary_border} !important`,
          backgroundColor: grafanaTokens.colors_text_primary(grafanaTokens.colors_background_primary, 0.05),
  },
  indentation: {
    marginLeft: `calc(var(--depth) * ${themeSpacing(3)})`,
  },
  angleButton: {
    boxShadow: 'none',
          border: 'none',
          background: 'transparent',
          borderRadius: grafanaTokens.shape_radius_default,
          padding: 0,
          color: 'inherit',
          lineHeight: 0,
  },
  nodeButton: {
    boxShadow: 'none',
          border: 'none',
          background: 'transparent',
          padding: 0,
          borderRadius: grafanaTokens.shape_radius_default,
          color: 'inherit',
          display: 'flex',
          flexGrow: 1,
          alignItems: 'center',
          gap: themeSpacing(0.5),
          overflow: 'hidden',
          ' > span': {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          },
  },
  nodeName: {
    display: 'flex',
          gap: themeSpacing(0.5),
          flexGrow: 1,
          alignItems: 'center',
          overflow: 'hidden',
  },
  hiddenIcon: {
    color: grafanaTokens.colors_text_secondary,
          marginLeft: themeSpacing(1),
  },
  nodeButtonClone: {
    color: grafanaTokens.colors_text_secondary,
  },
  outlineInput: {
    border: `1px solid ${grafanaTokens.colors_border_medium}`,
          height: themeSpacing(3),
          borderRadius: grafanaTokens.shape_radius_default,
    
          '&:focus': {
            outline: 'none',
            boxShadow: 'none',
          },
  },
  nodeChildren: {
    display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          gap: themeSpacing(0.5),
    
          // tree line
          '::before': {
            content: '""',
            position: 'absolute',
            width: '1px',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 1,
            background: grafanaTokens.colors_border_weak,
            marginLeft: `calc(11px + ${themeSpacing(3)} * var(--depth))`,
          },
  },
});
