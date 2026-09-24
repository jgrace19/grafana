import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const variableSetEditableElementStyles = stylex.create({
  variableItem: {
    display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: themeSpacing(1),
          padding: themeSpacing(0.5),
          borderRadius: grafanaTokens.shape_radius_default,
          cursor: 'pointer',
          ['@media (prefers-reduced-motion: no-preference), @media (prefers-reduced-motion: reduce)']: {
            transitionProperty: 'color',
            transitionDuration: '150ms',
          },
          button: {
            visibility: 'hidden',
          },
          ':hover': {
            color: grafanaTokens.colors_text_link,
            button: {
              visibility: 'visible',
            },
          },
  },
  variableContent: {
    display: 'flex',
          alignItems: 'center',
          gap: themeSpacing(0.5),
  },
  dragHandle: {
    display: 'flex',
          alignItems: 'center',
          cursor: 'grab',
          color: grafanaTokens.colors_text_secondary,
          ':active': {
            cursor: 'grabbing',
          },
  },
  hiddenIcon: {
    color: grafanaTokens.colors_text_secondary,
          marginLeft: themeSpacing(1),
  },
});
