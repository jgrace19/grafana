import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../core/stylex/spacing';

export const navToolbarActionsStyles = stylex.create({
  hiddenElementsContainer: {
    display: 'flex',
          padding: 0,
          gap: themeSpacing(1),
          whiteSpace: 'nowrap',
  },
  buttonWithExtraMargin: {
    margin: themeSpacingShorthand(0, 0.5),
  },
  publicBadge: {
    color: 'grey',
          backgroundColor: 'transparent',
          border: '1px solid',
  },
});
