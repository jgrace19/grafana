import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const timeRegionEditorStyles = stylex.create({
  wrapper: {
    maxWidth: themeSpacing(60),
          marginBottom: themeSpacing(2),
  },
  timezoneContainer: {
    padding: '5px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '12px',
  },
  timezone: {
    marginRight: '5px',
  },
});
