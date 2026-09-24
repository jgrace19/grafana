import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const arcOptionsEditorStyles = stylex.create({
  section: {
    display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: `0 ${themeSpacing(1)}`,
          marginBottom: themeSpacing(1),
  },
});
