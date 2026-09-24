import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../stylex/spacing';

export const alertInstanceModalSelectorStyles = stylex.create({
  container: {
    display: 'grid',
          gridTemplateColumns: '1fr 1.5fr',
          gridTemplateRows: 'min-content auto',
          gap: themeSpacing(2),
          flex: 1,
  },
  tag: {
    margin: '5px',
  },
  column: {
    flex: '1 1 auto',
  },
  alertLabels: {
    overflowX: 'auto',
          height: '32px',
  },
  ruleTitle: {
    height: '22px',
          fontWeight: grafanaTokens.typography_fontWeightBold,
  },
  rowButton: {
    padding: themeSpacing(0.5),
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          textAlign: 'left',
          whiteSpace: 'nowrap',
          cursor: 'pointer',
          border: '2px solid transparent',
    
          '&:disabled': {
            cursor: 'not-allowed',
            color: grafanaTokens.colors_text_disabled,
          },
  },
  rowButtonTitle: {
    overflowX: 'auto',
  },
  rowSelected: {
    borderColor: grafanaTokens.colors_primary_border,
  },
  rowOdd: {
    backgroundColor: grafanaTokens.colors_background_secondary,
  },
  instanceButton: {
    display: 'flex',
          gap: themeSpacing(1),
          justifyContent: 'space-between',
          alignItems: 'center',
  },
  loadingPlaceholder: {
    height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
  },
  selectedRulePlaceholder: {
    width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          textAlign: 'center',
          fontWeight: grafanaTokens.typography_fontWeightBold,
  },
  modal: {
    height: '100%',
  },
  modalContent: {
    flex: 1,
          display: 'flex',
          flexDirection: 'column',
  },
  modalAlert: {
    flexGrow: 0,
  },
  warnIcon: {
    fill: grafanaTokens.colors_warning_main,
  },
  labels: {
    justifyContent: 'flex-start',
  },
  alertFolder: {
    height: '20px',
          fontSize: grafanaTokens.typography_bodySmall_fontSize,
          color: grafanaTokens.colors_text_secondary,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          columnGap: themeSpacing(1),
          alignItems: 'center',
  },
});
