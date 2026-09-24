import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing } from '../../../core/stylex/spacing';

export const conditionStyles = stylex.create({
  buttonWidth: {
    width: '75px',
  },
  buttonSelectText: {
    color: grafanaTokens.colors_primary_text,
    fontSize: grafanaTokens.typography_bodySmall_fontSize,
  },
  buttonBase: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: grafanaTokens.shape_radius_default,
    fontWeight: grafanaTokens.typography_fontWeightMedium,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: grafanaTokens.colors_border_weak,
    whiteSpace: 'nowrap',
    padding: themeSpacing(0, 1),
    backgroundColor: grafanaTokens.colors_background_canvas,
    color: grafanaTokens.colors_primary_text,
    fontSize: grafanaTokens.typography_bodySmall_fontSize,
  },
});
