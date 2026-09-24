import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const draggableListItemStyles = stylex.create({
  listItem: {
    display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: themeSpacing(0.5),
          padding: themeSpacing(0.25),
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
