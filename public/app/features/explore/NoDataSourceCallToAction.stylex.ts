import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const noDataSourceCallToActionStyles = stylex.create({
  root: {
    maxWidth: `${theme.breakpoints.values.lg}px`,
        marginTop: themeSpacing(2),
        alignSelf: 'center',
  },
});
