import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing } from '../../../../core/stylex/spacing';

export const autoGridLayoutRendererStyles = stylex.create({
  container: {
    position: 'relative',
    ':hover .dashboard-canvas-controls, :focus-within .dashboard-canvas-controls': {
      opacity: 1,
    },
  },
  containerFillScreen: {
    flexGrow: 1,
  },
  containerEditing: {
    paddingBottom: themeSpacing(5),
    position: 'relative',
  },
  dropPlaceholder: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: grafanaTokens.colors_primary_main,
    borderRadius: grafanaTokens.shape_radius_default,
    backgroundColor: grafanaTokens.colors_primary_transparent,
    minHeight: '100px',
  },
});
