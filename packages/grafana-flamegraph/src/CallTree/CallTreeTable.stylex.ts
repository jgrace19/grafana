import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const callTreeTableStyles = stylex.create({
  scrollContainer: {
    '::-webkit-scrollbar': {
      width: '8px',
    },
    '::-webkit-scrollbar-track': {
      backgroundColor: grafanaTokens.colors_background_secondary,
    },
    '::-webkit-scrollbar-thumb': {
      backgroundColor: grafanaTokens.colors_text_disabled,
      borderRadius: grafanaTokens.shape_radius_default,
    },
    '::-webkit-scrollbar-thumb:hover': {
      backgroundColor: grafanaTokens.colors_text_secondary,
    },
  },
  table: {
    width: '100%',
    tableLayout: 'fixed',
    borderCollapse: 'collapse',
    fontSize: grafanaTokens.typography_size_md,
    color: grafanaTokens.colors_text_primary,
  },
  thead: {
    backgroundColor: grafanaTokens.colors_background_secondary,
  },
  th: {
    padding: '4px 6px',
    height: '36px',
    textAlign: 'left',
    fontWeight: grafanaTokens.typography_fontWeightMedium,
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: grafanaTokens.colors_border_weak,
    cursor: 'pointer',
    userSelect: 'none',
    ':hover': {
      backgroundColor: grafanaTokens.colors_action_hover,
    },
  },
  tbody: {
    backgroundColor: grafanaTokens.colors_background_primary,
  },
  tr: {
    ':hover': {
      backgroundColor: grafanaTokens.colors_action_hover,
    },
  },
  focusedRow: {
    backgroundColor: grafanaTokens.colors_action_selected,
    borderLeftWidth: '3px',
    borderLeftStyle: 'solid',
    borderLeftColor: grafanaTokens.colors_primary_main,
    fontWeight: grafanaTokens.typography_fontWeightMedium,
    ':hover': {
      backgroundColor: grafanaTokens.colors_action_hover,
    },
  },
  callersTargetRow: {
    backgroundColor: grafanaTokens.colors_action_selected,
    borderLeftWidth: '3px',
    borderLeftStyle: 'solid',
    borderLeftColor: grafanaTokens.colors_info_main,
    fontWeight: grafanaTokens.typography_fontWeightMedium,
    ':hover': {
      backgroundColor: grafanaTokens.colors_action_hover,
    },
  },
  searchMatchRow: {
    backgroundColor: grafanaTokens.colors_warning_transparent,
    borderLeftWidth: '3px',
    borderLeftStyle: 'solid',
    borderLeftColor: grafanaTokens.colors_warning_main,
    fontWeight: grafanaTokens.typography_fontWeightMedium,
    ':hover': {
      backgroundColor: grafanaTokens.colors_warning_transparent,
    },
  },
  td: {
    padding: '0px 6px',
    borderBottomWidth: 0,
    borderBottomStyle: 'none',
    height: '20px',
    verticalAlign: 'middle',
    overflow: 'hidden',
  },
  sortIcon: {
    marginLeft: grafanaTokens.spacing_x0_5,
  },
  actionsColumnCell: {
    backgroundColor: grafanaTokens.colors_background_secondary,
    ':hover': {
      backgroundColor: grafanaTokens.colors_background_secondary,
    },
  },
  valueColumnCell: {
    overflow: 'visible',
    textAlign: 'right',
  },
});
