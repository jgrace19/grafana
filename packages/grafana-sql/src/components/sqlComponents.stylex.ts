import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const sqlEditorStyles = stylex.create({
  lazyContainer: {
    marginBottom: 'unset',
    marginLeft: grafanaTokens.spacing_x1,
  },
  horizontalDivider: {
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: grafanaTokens.colors_border_weak,
    marginTop: grafanaTokens.spacing_x2,
    marginBottom: grafanaTokens.spacing_x2,
    width: '100%',
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  confirmTitleText: {
    paddingLeft: grafanaTokens.spacing_x2,
  },
  confirmModalHeaderTitle: {
    fontSize: grafanaTokens.typography_size_lg,
    float: 'left',
    paddingTop: grafanaTokens.spacing_x1,
    marginTop: grafanaTokens.spacing_x0,
    marginBottom: grafanaTokens.spacing_x0,
    marginLeft: grafanaTokens.spacing_x2,
    marginRight: grafanaTokens.spacing_x2,
  },
  rawModal: {
    width: '95vw',
    height: '95vh',
  },
  rawModalContent: {
    height: '100%',
    paddingTop: 0,
  },
  queryToolboxContainer: {
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: grafanaTokens.colors_border_medium,
    borderTopWidth: 0,
    borderTopStyle: 'none',
    padding: grafanaTokens.spacing_x0_5,
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'space-between',
    fontSize: grafanaTokens.typography_bodySmall_fontSize,
  },
  queryToolboxError: {
    color: grafanaTokens.colors_error_text,
    fontSize: grafanaTokens.typography_bodySmall_fontSize,
    fontFamily: grafanaTokens.typography_fontFamilyMonospace,
  },
  queryToolboxValid: {
    color: grafanaTokens.colors_success_text,
  },
  queryToolboxInfo: {
    color: grafanaTokens.colors_text_secondary,
  },
  queryToolboxHint: {
    color: grafanaTokens.colors_text_disabled,
    whiteSpace: 'nowrap',
    cursor: 'help',
  },
  validatorError: {
    color: grafanaTokens.colors_error_text,
    fontSize: grafanaTokens.typography_bodySmall_fontSize,
    fontFamily: grafanaTokens.typography_fontFamilyMonospace,
  },
  validatorValid: {
    color: grafanaTokens.colors_success_text,
  },
  validatorInfo: {
    color: grafanaTokens.colors_text_secondary,
  },
  previewGrow: {
    flexGrow: 1,
  },
  previewLabel: {
    fontSize: 12,
    fontWeight: grafanaTokens.typography_fontWeightMedium,
  },
  previewLabelWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: grafanaTokens.spacing_x0_5,
  },
  selectAddButton: {
    alignSelf: 'flex-start',
  },
  selectLabel: {
    padding: 0,
    margin: 0,
    width: 'unset',
  },
});
