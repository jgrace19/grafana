import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const draggableListStyles = stylex.create({
  list: {
    listStyle: 'none',
          margin: 0,
          padding: 0,
  },
  itemButton: {
    display: 'flex',
          flexDirection: 'row',
          gap: themeSpacing(0.5),
          alignItems: 'center',
          justifyContent: 'space-between',
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
});
