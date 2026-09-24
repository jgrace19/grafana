import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../stylex/spacing';

export const grafanaRouteErrorStyles = stylex.create({
  container: {
    width: '500px',
        margin: themeSpacingShorthand(8, 'auto'),
  },
});
