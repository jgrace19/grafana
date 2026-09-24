import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from './stylex/spacing';

export const grafanaRuleQueryViewerStyles = stylex.create({
  queryBox_container: {
    flex: '1 0 25%',
        border: `1px solid ${grafanaTokens.colors_border_weak}`,
        maxWidth: '100%',
        borderRadius: grafanaTokens.shape_radius_default,
        display: 'flex',
        flexDirection: 'column',
  },
  queryBox_header: {
    display: 'flex',
        alignItems: 'center',
        gap: themeSpacing(1),
        padding: themeSpacing(1),
        backgroundColor: grafanaTokens.colors_background_secondary,
  },
  queryBox_textBlock: {
    border: `1px solid ${grafanaTokens.colors_border_weak}`,
        padding: themeSpacingShorthand(0.5, 1),
        backgroundColor: grafanaTokens.colors_background_primary,
        borderRadius: grafanaTokens.shape_radius_default,
  },
  queryBox_refId: {
    color: grafanaTokens.colors_text_link,
        padding: themeSpacingShorthand(0.5, 1),
        border: `1px solid ${grafanaTokens.colors_border_weak}`,
        borderRadius: grafanaTokens.shape_radius_default,
  },
  queryBox_previewWrapper: {
    padding: themeSpacing(1),
  },
  classicConditionViewer_container: {
    display: 'grid',
        gridTemplateColumns: 'repeat(6, max-content)',
        gap: themeSpacingShorthand(0, 1),
  },
  reduceConditionViewer_container: {
    display: 'grid',
        gap: themeSpacing(0.5),
        gridTemplateRows: '1fr 1fr',
        gridTemplateColumns: 'repeat(4, 1fr)',
    
        '> :nth-child(6)': {
          gridColumn: 'span 3',
        },
  },
  resampleExpressionViewer_container: {
    display: 'grid',
        gap: themeSpacing(0.5),
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: '1fr 1fr',
  },
  commonQuery_blue: {
    color: grafanaTokens.colors_text_link,
  },
  commonQuery_bold: {
    fontWeight: grafanaTokens.typography_fontWeightBold,
  },
  commonQuery_label: {
    display: 'flex',
        alignItems: 'center',
        padding: themeSpacingShorthand(0.5, 1),
        backgroundColor: grafanaTokens.colors_background_secondary,
        fontSize: grafanaTokens.typography_bodySmall_fontSize,
        lineHeight: grafanaTokens.typography_bodySmall_lineHeight,
        fontWeight: grafanaTokens.typography_fontWeightBold,
        borderRadius: grafanaTokens.shape_radius_default,
  },
  commonQuery_value: {
    padding: themeSpacingShorthand(0.5, 1),
        border: `1px solid ${grafanaTokens.colors_border_weak}`,
        borderRadius: grafanaTokens.shape_radius_default,
  },
});
