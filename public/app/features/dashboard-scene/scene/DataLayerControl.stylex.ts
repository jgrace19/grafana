import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../core/stylex/spacing';

export const dataLayerControlStyles = stylex.create({
  container: {
    display: 'flex',
        alignItems: 'center',
  },
  menuContainer: {
    display: 'flex',
        alignItems: 'center',
        gap: themeSpacing(1),
        padding: themeSpacing(1),
  },
  controlWrapper: {
    height: themeSpacing(2),
        ' > div': {
          border: 'none',
          background: 'transparent',
          paddingRight: themeSpacing(0.5),
          height: themeSpacing(2),
          ':hover': {
            border: 'none',
            background: 'transparent',
          },
        },
  },
  menuLabel: {
    marginTop: 0,
        marginBottom: 0,
  },
  labelSelectable: {
    cursor: 'pointer',
  },
});
