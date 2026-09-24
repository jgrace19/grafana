import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const linkListStyles = stylex.create({
  linkItem: {
    display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: themeSpacing(0.5),
          padding: themeSpacing(0.5),
  },
  linkContent: {
    display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: themeSpacing(0.5),
          width: '100%',
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
