import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../core/stylex/spacing';

export const dashboardLinkRendererStyles = stylex.create({
  linkContainer: {
    display: 'inline-flex',
          alignItems: 'center',
          verticalAlign: 'middle',
          lineHeight: 1,
          flexWrap: 'wrap',
          gap: themeSpacing(1),
  },
});
