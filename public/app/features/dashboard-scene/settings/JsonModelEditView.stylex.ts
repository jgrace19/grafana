import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../core/stylex/spacing';

export const jsonModelEditViewStyles = stylex.create({
  wrapper: {
    display: 'flex',
        height: '100%',
        flexDirection: 'column',
        gap: themeSpacing(2),
  },
  codeEditor: {
    flexGrow: 1,
  },
});
