import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../core/stylex/spacing';

export const timezonesEditorStyles = stylex.create({
  list: {
    listStyle: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: themeSpacing(0.5),
  },
  listItem: {
    display: 'flex',
        gap: themeSpacing(1),
  },
});
