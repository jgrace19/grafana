import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../../../core/stylex/spacing';

export const optionFieldStyles = stylex.create({
  field: {
    display: 'flex',
          alignItems: 'center',
          gap: themeSpacing(1),
          padding: themeSpacingShorthand(0.5, 0),
  },
  fieldLabel: {
    width: CONTENT_SIDE_BAR.fieldLabelWidth,
          flexShrink: 0,
          color: grafanaTokens.colors_text_primary,
          fontSize: grafanaTokens.typography_bodySmall_fontSize,
          fontFamily: grafanaTokens.typography_fontFamilyMonospace,
          whiteSpace: 'nowrap',
  },
  fieldContent: {
    flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: themeSpacing(1),
          minWidth: 0,
  },
  fieldInput: {
    width: CONTENT_SIDE_BAR.labelWidth,
          flexShrink: 0,
  },
  infoIcon: {
    color: grafanaTokens.colors_text_secondary,
          flexShrink: 0,
  },
  hint: {
    color: grafanaTokens.colors_text_secondary,
          fontSize: grafanaTokens.typography_bodySmall_fontSize,
          fontFamily: grafanaTokens.typography_fontFamilyMonospace,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          minWidth: 0,
  },
});
