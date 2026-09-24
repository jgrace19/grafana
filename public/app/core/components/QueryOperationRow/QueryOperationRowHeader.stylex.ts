import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../stylex/spacing';

export const queryOperationRowHeaderStyles = stylex.create({
  header: {
    label: 'Header',
        padding: themeSpacingShorthand(0.5, 0.5),
        borderRadius: grafanaTokens.shape_radius_default,
        background: grafanaTokens.colors_background_secondary,
        minHeight: themeSpacing(4),
        display: 'grid',
        gridTemplateColumns: 'minmax(100px, max-content) min-content',
        alignItems: 'center',
        justifyContent: 'space-between',
        whiteSpace: 'nowrap',
    
        '&:focus': {
          outline: 'none',
        },
  },
  column: {
    label: 'Column',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
  },
  dragIcon: {
    cursor: 'grab',
        color: grafanaTokens.colors_text_disabled,
        margin: themeSpacingShorthand(0, 0.5),
        ':hover': {
          color: grafanaTokens.colors_text_primary,
        },
  },
  collapseIcon: {
    marginLeft: themeSpacing(0.5),
        color: grafanaTokens.colors_text_disabled,
  },
  titleWrapper: {
    display: 'flex',
        alignItems: 'center',
        flexGrow: 1,
        cursor: 'pointer',
        overflow: 'hidden',
        marginRight: themeSpacing(0.5),
  },
  title: {
    fontWeight: grafanaTokens.typography_fontWeightBold,
        color: grafanaTokens.colors_text_link,
        marginLeft: themeSpacing(0.5),
        overflow: 'hidden',
        textOverflow: 'ellipsis',
  },
  disabled: {
    color: grafanaTokens.colors_text_disabled,
  },
});
