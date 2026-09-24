import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing } from '../../core/stylex/spacing';

export const libraryPanelModalStyles = stylex.create({
  myTable: {
    maxHeight: '204px',
    overflowY: 'auto',
    marginTop: '11px',
    marginBottom: '28px',
    borderRadius: grafanaTokens.shape_radius_default,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: grafanaTokens.colors_action_hover,
    background: grafanaTokens.colors_background_primary,
    color: grafanaTokens.colors_text_secondary,
    fontSize: grafanaTokens.typography_h6_fontSize,
    width: '100%',
    thead: {
      color: '#538ade',
      fontSize: grafanaTokens.typography_bodySmall_fontSize,
    },
    'th, td': {
      padding: '6px 13px',
      height: themeSpacing(4),
    },
    'tbody > tr:nth-child(odd)': {
      background: grafanaTokens.colors_background_secondary,
    },
  },
  noteTextbox: {
    marginBottom: themeSpacing(4),
  },
  textInfo: {
    color: grafanaTokens.colors_text_secondary,
    fontSize: grafanaTokens.typography_size_sm,
  },
  dashboardSearch: {
    marginTop: themeSpacing(2),
  },
  modal: {
    width: '500px',
  },
  modalText: {
    fontSize: grafanaTokens.typography_h4_fontSize,
    color: grafanaTokens.colors_text_primary,
    marginBottom: themeSpacing(4),
    paddingTop: themeSpacing(2),
  },
});
