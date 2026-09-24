import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../../core/stylex/spacing';

export const transformationDebugDisplayStyles = stylex.create({
  debugSeparator: {
    width: '48px',
          minHeight: '300px',
          display: 'flex',
          alignItems: 'center',
          alignSelf: 'stretch',
          justifyContent: 'center',
          margin: `0 ${themeSpacing(0.5)}`,
          color: grafanaTokens.colors_primary_text,
  },
  debugTitle: {
    padding: `${themeSpacing(1)} ${themeSpacing(0.25)}`,
          fontFamily: grafanaTokens.typography_fontFamilyMonospace,
          fontSize: grafanaTokens.typography_bodySmall_fontSize,
          color: grafanaTokens.colors_text_primary,
          borderBottom: `1px solid ${grafanaTokens.colors_border_weak}`,
          flexGrow: 0,
          flexShrink: 1,
  },
  debug: {
    marginTop: themeSpacing(1),
          padding: `0 ${themeSpacingShorthand(1, 1, 1)}`,
          border: `1px solid ${grafanaTokens.colors_border_weak}`,
          background: `${true}`,
          borderRadius: grafanaTokens.shape_radius_default,
          width: '100%',
          minHeight: '300px',
          display: 'flex',
          flexDirection: 'column',
          alignSelf: 'stretch',
  },
  debugJson: {
    flexGrow: 1,
          height: '100%',
          overflow: 'hidden',
          padding: themeSpacing(0.5),
  },
});
