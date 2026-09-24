import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../../core/stylex/spacing';

export const panelGroupByActionPopoverStyles = stylex.create({
  menuContainer: {
    display: 'flex',
        flexDirection: 'column',
        background: grafanaTokens.colors_background_elevated,
        border: `1px solid ${grafanaTokens.colors_border_weak}`,
        borderRadius: grafanaTokens.shape_radius_default,
        boxShadow: grafanaTokens.shadows_z3,
        padding: themeSpacing(2),
  },
  searchContainer: {
    width: '100%',
        paddingBottom: themeSpacing(1),
        borderBottom: `1px solid ${grafanaTokens.colors_border_weak}`,
  },
  listContainer: {
    flex: 1,
        overflow: 'auto',
        minHeight: '100px',
        maxHeight: '300px',
        padding: themeSpacing(0.5),
        borderBottom: `1px solid ${grafanaTokens.colors_border_weak}`,
  },
  option: {
    display: 'flex',
        alignItems: 'center',
        gap: themeSpacing(1),
        padding: themeSpacing(1),
        cursor: 'pointer',
        borderRadius: grafanaTokens.shape_radius_default,
        ':hover': {
          background: grafanaTokens.colors_background_secondary,
        },
        '&:focus-visible': {
          outline: `2px solid ${grafanaTokens.colors_primary_border}`,
          outlineOffset: '-2px',
        },
  },
  emptyMessage: {
    padding: themeSpacing(2),
        textAlign: 'center',
        color: grafanaTokens.colors_text_secondary,
  },
});
