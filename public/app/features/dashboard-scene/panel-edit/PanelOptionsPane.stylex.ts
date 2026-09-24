import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../core/stylex/spacing';

export const panelOptionsPaneStyles = stylex.create({
  top: {
    display: 'flex',
          flexDirection: 'row',
          padding: themeSpacingShorthand(1, 2),
          gap: themeSpacing(2),
          justifyContent: 'space-between',
          alignItems: 'center',
  },
  searchOptions: {
    minHeight: themeSpacing(4),
  },
  searchWrapper: {
    padding: themeSpacingShorthand(1, 2, 2, 2),
  },
  rotateIcon: {
    rotate: '180deg',
  },
  pluginIcon: {
    height: '22px',
          width: '22px',
  },
});
