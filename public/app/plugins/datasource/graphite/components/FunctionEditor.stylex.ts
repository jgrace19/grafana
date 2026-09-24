import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const functionEditorStyles = stylex.create({
  icon: {
    marginRight: themeSpacing(0.5),
  },
  label: {
    fontWeight: grafanaTokens.typography_fontWeightMedium,
          fontSize: grafanaTokens.typography_bodySmall_fontSize,
          cursor: 'pointer',
          display: 'inline-block',
          overflowWrap: 'anywhere',
          height: '100%',
  },
});
