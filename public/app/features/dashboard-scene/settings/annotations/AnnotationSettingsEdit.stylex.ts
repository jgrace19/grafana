import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const annotationSettingsEditStyles = stylex.create({
  settingsForm: {
    maxWidth: themeSpacing(60),
          marginBottom: themeSpacing(2),
  },
  select: {
    marginTop: '8px',
  },
});
