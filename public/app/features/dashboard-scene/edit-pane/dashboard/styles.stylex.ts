import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const styles = stylex.create({
  sectionContainer: {
    ' :has(> ul)': {
            padding: themeSpacingShorthand(0, 2, 1, 2),
          },
  },
  list: {
    listStyle: 'none',
          margin: 0,
          padding: 0,
          minHeight: themeSpacing(4),
  },
  listItem: {
    display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: themeSpacing(0.5),
          padding: themeSpacing(0.25),
  },
  itemName: {
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
  dragHandle: {
    alignSelf: 'stretch',
          cursor: 'grab',
          color: grafanaTokens.colors_text_secondary,
          ':hover': {
            color: grafanaTokens.colors_text_primary,
          },
          ':active': {
            cursor: 'grabbing',
          },
  },
});
