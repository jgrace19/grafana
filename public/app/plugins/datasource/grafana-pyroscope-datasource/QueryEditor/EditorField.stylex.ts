import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const editorFieldStyles = stylex.create({
  space: {
    paddingRight: themeSpacing(0),
        paddingBottom: themeSpacing(0.5),
  },
  root: {
    minWidth: themeSpacing(width ?? 0),
  },
  label: {
    fontSize: 12,
        fontWeight: grafanaTokens.typography_fontWeightMedium,
  },
  optional: {
    fontStyle: 'italic',
        color: grafanaTokens.colors_text_secondary,
  },
  field: {
    marginBottom: 0, // GrafanaUI/Field has a bottom margin which we must remove
  },
  icon: {
    color: grafanaTokens.colors_text_secondary,
        marginLeft: themeSpacing(1),
        ':hover': {
          color: grafanaTokens.colors_text_primary,
        },
  },
});
