import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../stylex/spacing';

export const nestedFolderListStyles = stylex.create({
  table: {
    background: theme.components.input.background,
  },
  emptyMessage: {
    padding: themeSpacing(1),
          textAlign: 'center',
          width: '100%',
  },
  folderButtonSpacer: {
    paddingLeft: themeSpacing(2.5),
  },
  row: {
    display: 'flex',
          position: 'relative',
          alignItems: 'center',
          [':not(:first-child)']: {
            borderTop: `solid 1px ${grafanaTokens.colors_border_weak}`,
          },
  },
  rowFocused: {
    backgroundColor: grafanaTokens.colors_background_secondary,
  },
  rowSelected: {
    '&::before': {
            display: 'block',
            content: '""',
            position: 'absolute',
            left: 0,
            bottom: 0,
            top: 0,
            width: 4,
            borderRadius: grafanaTokens.shape_radius_default,
            backgroundImage: grafanaTokens.colors_gradients_brandVertical,
          },
  },
  label: {
    label: 'label',
          display: 'flex',
          alignItems: 'center',
          gap: themeSpacing(1),
          lineHeight: ROW_HEIGHT + 'px',
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          ':hover': {
            textDecoration: 'underline',
            cursor: 'pointer',
          },
  },
  teamOwner: {
    label: 'teamOwner',
          display: 'flex',
          marginLeft: themeSpacing(1),
          alignItems: 'center',
          gap: themeSpacing(0.5),
          minWidth: 0,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          flex: '0 1 auto',
          pointerEvents: 'none', // avoid interfering with folder selection
  },
});
