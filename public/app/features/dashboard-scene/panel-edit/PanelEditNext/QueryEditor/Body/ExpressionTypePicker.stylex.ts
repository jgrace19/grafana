import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../../../core/stylex/spacing';

export const expressionTypePickerStyles = stylex.create({
  grid: {
    display: 'grid',
        gap: themeSpacing(1),
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  },
  image: {
    display: 'block',
        maxWidth: '100%',
        marginTop: themeSpacing(2),
  },
});
