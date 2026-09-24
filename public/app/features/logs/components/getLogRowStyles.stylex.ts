import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../core/stylex/spacing';

export const logRowStyles = stylex.create({
  logsRowLevelColor: {
    '::after': {},
  },
  logsRowLevel: {
    maxWidth: themeSpacing(1.25),
          cursor: 'default',
          '::after': {
            content: "''",
            display: 'block',
            position: 'absolute',
            top: '1px',
            bottom: '1px',
            width: '3px',
            left: themeSpacing(0.5),
          },
  },
  logsRowWithError: {
    maxWidth: `${themeSpacing(1.5)}`,
  },
  logsRowMatchHighLight: {
    background: 'inherit',
          padding: 'inherit',
  },
  logRows: {
    position: 'relative',
  },
  shortcut: {
    display: 'inline-flex',
          alignItems: 'center',
          gap: themeSpacing(1),
          color: grafanaTokens.colors_text_secondary,
          opacity: 0.7,
          fontSize: grafanaTokens.typography_bodySmall_fontSize,
          marginTop: themeSpacing(1),
  },
  logsRowsTable: {
    fontFamily: grafanaTokens.typography_fontFamilyMonospace,
          fontSize: grafanaTokens.typography_bodySmall_fontSize,
          width: '100%',
          position: 'relative',
  },
  logsRowsTableContain: {
    contain: 'strict',
  },
  highlightBackground: {

  },
  logsRow: {
    width: '100%',
          cursor: 'pointer',
          verticalAlign: 'top',
    
          '&:focus-within': {
            outline: `2px solid ${grafanaTokens.colors_primary_border}`,
            outlineOffset: '-2px',
          },
    
          ':hover': {
            '.log-row-menu': {
              zIndex: 1,
            },
    
          },
    
          'td:not(.log-row-menu-cell):last-child': {
            width: '100%',
          },
    
          '> td:not(.log-row-menu-cell)': {
            position: 'relative',
            paddingRight: themeSpacing(1),
            borderTop: '1px solid transparent',
            borderBottom: '1px solid transparent',
            height: '100%',
          },
  },
  logsRowDuplicates: {
    textAlign: 'right',
          width: '4em',
          cursor: 'default',
  },
  logIconError: {
    color: grafanaTokens.colors_warning_main,
          position: 'relative',
          top: '-2px',
  },
  logIconInfo: {
    color: grafanaTokens.colors_info_main,
          position: 'relative',
          top: '-2px',
  },
  logsRowToggleDetails: {
    fontSize: '9px',
          maxWidth: '15px',
  },
  logsRowLocalTime: {
    whiteSpace: 'nowrap',
  },
  logsRowLabels: {
    whiteSpace: 'nowrap',
          maxWidth: '22em',
    
          /* This is to make the labels vertical align */
          '> span': {
            marginTop: '0.75px',
          },
  },
  logsRowMessage: {
    whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
          overflowWrap: 'anywhere',
          width: '100%',
          textAlign: 'left',
  },
  copyLogButton: {
    padding: themeSpacingShorthand(0, 0, 0, 0.5),
          height: themeSpacing(3),
          width: themeSpacing(3.25),
          lineHeight: themeSpacing(2.5),
          overflow: 'hidden',
          ':hover': {
            backgroundColor: colorManipulator.alpha(grafanaTokens.colors_text_primary, 0.12),
          },
  },
  logDetailsContainer: {
    border: `1px solid ${grafanaTokens.colors_border_medium}`,
          padding: themeSpacingShorthand(0, 1, 1),
          borderRadius: grafanaTokens.shape_radius_default,
          margin: themeSpacingShorthand(2.5, 1, 2.5, 2),
          cursor: 'default',
  },
  logDetailsTable: {
    lineHeight: '18px',
          width: '100%',
          'td:last-child': {
            width: '100%',
          },
  },
  logsDetailsIcon: {
    position: 'relative',
          paddingTop: '1px',
          paddingBottom: '1px',
          paddingRight: themeSpacing(0.75),
  },
  logDetailsLabel: {
    maxWidth: '30em',
          padding: themeSpacingShorthand(0, 1),
          overflowWrap: 'break-word',
  },
  logDetailsHeading: {
    fontWeight: grafanaTokens.typography_fontWeightBold,
          padding: themeSpacingShorthand(1, 0, 0.5),
  },
  logDetailsValue: {
    position: 'relative',
          verticalAlign: 'middle',
          cursor: 'default',
    
          ':hover': {
          },
  },
  detailsToggle: {
    appearance: 'none',
          background: 'none',
          border: 'none',
          padding: 0,
          // Don't increase the height of the row
          maxHeight: '19px',
    
          // Don't show default button box-shadow on focus, we apply outline to the entire row instead
          '&:focus-visible': {
            boxShadow: 'none',
          },
    
          '&:focus': {
            outline: 0,
          },
          '::after': {
            content: '""',
            inset: 0,
            position: 'absolute',
          },
  },
  topVerticalAlign: {
    marginTop: themeSpacing(-0.9),
          marginLeft: themeSpacing(-0.25),
  },
  detailsOpen: {
    ':hover': {
          },
  },
  errorLogRow: {
    color: grafanaTokens.colors_text_secondary,
  },
  positionRelative: {
    position: 'relative',
  },
  rowWithContext: {
    zIndex: 1,
          display: 'inherit',
  },
  horizontalScroll: {
    whiteSpace: 'pre',
  },
  contextNewline: {
    display: 'block',
          marginLeft: '0px',
  },
  rowMenu: {
    display: 'flex',
          flexWrap: 'nowrap',
          flexDirection: 'row',
          alignContent: 'flex-end',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          position: 'absolute',
          top: 0,
          bottom: 'auto',
          background: grafanaTokens.colors_background_primary,
          boxShadow: grafanaTokens.shadows_z3,
          padding: themeSpacingShorthand(0.5, 1, 0.5, 1),
          zIndex: 100,
          gap: themeSpacing(0.5),
    
          '& > button': {
            margin: 0,
          },
  },
  logRowMenuCell: {
    position: 'sticky',
          zIndex: grafanaTokens.zIndex_dropdown,
          marginTop: themeSpacing(-0.125),
          right: 0,
    
          '& > span': {
            transform: 'translateX(-100%)',
          },
  },
  logLine: {
    fontFamily: grafanaTokens.typography_fontFamilyMonospace,
          fontSize: grafanaTokens.typography_bodySmall_fontSize,
          letterSpacing: grafanaTokens.typography_bodySmall_letterSpacing,
          textAlign: 'left',
          padding: 0,
          userSelect: 'text',
  },
  logsRowLevelDetails: {
    '::after': {
            top: '-3px',
          },
  },
  logDetails: {
    cursor: 'default',
    
          ':hover': {
            backgroundColor: grafanaTokens.colors_background_primary,
          },
  },
  visibleRowMenu: {
    aspectRatio: '1/1',
          zIndex: 90,
  },
  linkButton: {
    '> button': {
            paddingTop: themeSpacing(0.5),
          },
  },
  hidden: {
    visibility: 'hidden',
  },
  unPinButton: {
    height: themeSpacing(3),
          lineHeight: themeSpacing(2.5),
  },
});
