import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const exportAsImageStyles = stylex.create({
  info: {
    marginBottom: themeSpacing(2),
  },
  buttonRow: {
    display: 'flex',
        gap: themeSpacing(2),
        marginBottom: themeSpacing(2),
  },
});
