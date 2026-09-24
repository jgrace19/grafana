import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../core/stylex/spacing';

export const controlActionsPopoverStyles = stylex.create({
  popover: {
    zIndex: grafanaTokens.zIndex_portal,
  },
  hoverActions: {
    display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        gap: themeSpacing(0.75),
        padding: themeSpacing(1),
        borderRadius: grafanaTokens.shape_radius_default,
        backgroundColor: grafanaTokens.colors_background_elevated,
        border: `1px solid ${grafanaTokens.colors_border_weak}`,
        boxShadow: grafanaTokens.shadows_z1,
        position: 'relative',
        top: '2px',
  },
  actionsDivider: {
    width: 1,
        alignSelf: 'stretch',
        backgroundColor: grafanaTokens.colors_border_medium,
  },
  action: {
    margin: 0,
        color: grafanaTokens.colors_text_primary,
        ['@media (prefers-reduced-motion: no-preference), @media (prefers-reduced-motion: reduce)']: {
          transitionProperty: 'color',
            transitionDuration: '150ms',
        },
  },
  editAction: {
    ':hover': {
          color: grafanaTokens.colors_primary_text,
        },
  },
  deleteAction: {
    ':hover': {
          color: grafanaTokens.colors_error_text,
        },
  },
});
