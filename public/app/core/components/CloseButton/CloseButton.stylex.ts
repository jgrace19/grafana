import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../stylex/spacing';

export const closeButtonStyles = stylex.create({
  root: {
    position: 'absolute',
        right: themeSpacing(0.5),
        top: themeSpacing(1),
  },
});
