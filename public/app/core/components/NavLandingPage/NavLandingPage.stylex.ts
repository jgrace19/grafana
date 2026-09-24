import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../stylex/spacing';

export const navLandingPageStyles = stylex.create({
  content: {
    display: 'flex',
        flexDirection: 'column',
        gap: themeSpacing(2),
  },
  grid: {
    display: 'grid',
        gap: themeSpacing(3),
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gridAutoRows: '138px',
        padding: themeSpacingShorthand(2, 0),
  },
});
