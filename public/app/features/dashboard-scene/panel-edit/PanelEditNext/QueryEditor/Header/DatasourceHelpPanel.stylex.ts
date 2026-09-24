import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../../../core/stylex/spacing';

export const datasourceHelpPanelStyles = stylex.create({
  container: {
    position: 'relative',
        padding: themeSpacing(2),
        backgroundColor: grafanaTokens.colors_background_primary,
        borderBottom: `1px solid ${grafanaTokens.colors_border_weak}`,
        maxHeight: '400px',
        overflowY: 'auto',
  },
  closeButton: {
    position: 'absolute',
        top: themeSpacing(1),
        right: themeSpacing(1),
        zIndex: 1,
  },
});
