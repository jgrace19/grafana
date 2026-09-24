import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../stylex/spacing';

export const labelsContentStyles = stylex.create({
  content: {
    display: 'flex',
        flexDirection: 'column',
        paddingLeft: themeSpacing(1),
        gap: themeSpacing(0.5),
  },
  labelRow: {
    display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: themeSpacing(1),
        minWidth: 0,
  },
  valueRow: {
    display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: themeSpacing(1),
        minWidth: 0,
        paddingLeft: themeSpacing(1),
        marginLeft: themeSpacing(1),
        borderLeft: `1px solid ${grafanaTokens.colors_border_weak}`,
  },
  collapseToggle: {
    margin: 0,
        flexShrink: 0,
  },
  labelHeaderKey: {
    minWidth: 0,
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
  },
  labelKeyButton: {
    fontWeight: grafanaTokens.typography_fontWeightBold,
        color: grafanaTokens.colors_text_secondary,
        minWidth: 0,
        '& > span': {
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          display: 'block',
          minWidth: 0,
        },
  },
  activeButton: {
    background: grafanaTokens.colors_action_selected,
        borderRadius: grafanaTokens.shape_radius_default,
  },
  valueCount: {
    flexShrink: 0,
        fontSize: grafanaTokens.typography_bodySmall_fontSize,
        color: grafanaTokens.colors_text_disabled,
        fontVariantNumeric: 'tabular-nums',
  },
  valueButton: {
    flex: 1,
        minWidth: 0,
        justifySelf: 'stretch',
        '& > span': {
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          display: 'block',
          minWidth: 0,
        },
  },
});
