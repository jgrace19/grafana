import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../core/stylex/spacing';

export const logsPanelStyles = stylex.create({
  container: {
    marginBottom: themeSpacing(1.5),
  },
  logListContainer: {
    minHeight: '100%',
        maxHeight: '100%',
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        overflow: 'hidden',
  },
  controlledLogsContainer: {
    height: '100%',
  },
  labelContainer: {
    margin: themeSpacingShorthand(0, 0, 0.5, 0.5),
        display: 'flex',
        alignItems: 'center',
  },
  labelContainerAscending: {
    margin: themeSpacingShorthand(0.5, 0, 0.5, 0),
  },
  label: {
    marginRight: themeSpacing(0.5),
        fontSize: grafanaTokens.typography_bodySmall_fontSize,
        fontWeight: grafanaTokens.typography_fontWeightMedium,
  },
});
