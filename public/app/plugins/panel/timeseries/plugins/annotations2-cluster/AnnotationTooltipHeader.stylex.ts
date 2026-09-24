import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../../core/stylex/spacing';

export const annotationTooltipHeaderStyles = stylex.create({
  wrapper: {
    borderBottom: `1px solid ${grafanaTokens.colors_border_weak}`,
  },
  subHeader: {
    fontSize: grafanaTokens.typography_bodySmall_fontSize,
        padding: themeSpacingShorthand(0, 1),
  },
  clusterIndex: {
    fontWeight: grafanaTokens.typography_fontWeightBold,
        marginRight: themeSpacing(1),
  },
  clusterCount: {
    fontSize: grafanaTokens.typography_bodySmall_fontSize,
  },
  timeRange: {
    fontFamily: grafanaTokens.typography_fontFamilyMonospace,
  },
  clusterWrapper: {
    background: grafanaTokens.colors_background_elevated,
        position: 'sticky',
        top: 0,
        left: 0,
        zIndex: 1,
        boxShadow: grafanaTokens.shadows_z1,
        borderBottom: `1px solid ${grafanaTokens.colors_border_weak}`,
  },
  header: {
    padding: themeSpacingShorthand(0.5, 1),
        fontWeight: grafanaTokens.typography_fontWeightBold,
        fontSize: grafanaTokens.typography_fontSize,
        color: grafanaTokens.colors_text_primary,
        display: 'flex',
  },
  meta: {
    width: '100%',
        display: 'flex',
        whiteSpace: 'nowrap',
        color: grafanaTokens.colors_text_primary,
        fontWeight: 400,
  },
  controls: {
    // space for all three icons
        minWidth: '54px',
        justifyContent: 'flex-end',
        display: 'flex',
        '> :last-child': {
          marginLeft: 0,
        },
  },
});
