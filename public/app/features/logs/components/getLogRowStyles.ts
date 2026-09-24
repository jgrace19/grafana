import * as stylex from '@stylexjs/stylex';
import memoizeOne from 'memoize-one';
import tinycolor from 'tinycolor2';

import { colorManipulator, type GrafanaTheme2, LogLevel } from '@grafana/data';
import { styleMixins } from '@grafana/ui';
import { zIndex } from '@grafana/ui/stylex/constants.stylex';
import { colors, components, shadows, shape, spacing, typography, v1 } from '@grafana/ui/stylex/tokens.stylex';

import { logRowVars } from './logRows.stylex';
import './LogRows.css';

export function getLogLevelStyle(theme: GrafanaTheme2, logLevel?: LogLevel) {
  switch (logLevel) {
    case LogLevel.crit:
    case LogLevel.critical:
      return levelStyles.critical;
    case LogLevel.error:
    case LogLevel.err:
      return levelStyles.error;
    case LogLevel.warning:
    case LogLevel.warn:
      return levelStyles.warning;
    case LogLevel.info:
      return levelStyles.info;
    case LogLevel.debug:
      return levelStyles.debug;
    case LogLevel.trace:
      return levelStyles.trace;
  }
  return theme.isLight ? levelStyles.unknownLight : levelStyles.unknownDark;
}

/**
 * `vars` sets the theme-derived colors of the rows below it: apply it to the `LogRows` root, or to the root of rows
 * composed elsewhere from `logRowStyles` and `LOGS_ROW_CLASS` (Explore live tailing).
 */
export const getLogRowStyles = memoizeOne((theme: GrafanaTheme2) => ({
  vars: varStyles.vars(
    styleMixins.hoverColor(theme.colors.background.secondary, theme),
    tinycolor(theme.colors.info.transparent).setAlpha(0.25).toString(),
    colorManipulator.alpha(theme.colors.text.primary, 0.12)
  ),
}));

/** Class names styled in LogRows.css: rules for elements the row components don't all render themselves. */
export const LOGS_ROW_CLASS = 'gf-logs-row';
export const LOGS_ROW_LABELS_CLASS = 'gf-logs-row-labels';
export const LOGS_ROW_MENU_CLASS = 'gf-logs-row-menu';
export const LOGS_DETAILS_TABLE_CLASS = 'gf-logs-details-table';
export const LOGS_DETAILS_COPY_CLASS = 'gf-logs-details-copy';

const varStyles = stylex.create({
  vars: (hoverBackground: string, highlightBackground: string, copyButtonHoverBackground: string) => ({
    [logRowVars['--gf-logs-row-hover-background']]: hoverBackground,
    [logRowVars['--gf-logs-row-highlight-background']]: highlightBackground,
    [logRowVars['--gf-logs-copy-button-hover-background']]: copyButtonHoverBackground,
  }),
});

const levelStyles = stylex.create({
  critical: { '::after': { backgroundColor: '#705da0' } },
  error: { '::after': { backgroundColor: '#e24d42' } },
  warning: { '::after': { backgroundColor: colors['--gf-colors-warning-main'] } },
  info: { '::after': { backgroundColor: '#7eb26d' } },
  debug: { '::after': { backgroundColor: '#1f78c1' } },
  trace: { '::after': { backgroundColor: '#6ed0e0' } },
  unknownLight: { '::after': { backgroundColor: v1['--gf-v1-palette-gray5'] } },
  unknownDark: { '::after': { backgroundColor: v1['--gf-v1-palette-gray2'] } },
});

export const logRowStyles = stylex.create({
  logsRowLevel: {
    maxWidth: `calc(${spacing['--gf-spacing-grid-size']} * 1.25)`,
    cursor: 'default',
    '::after': {
      content: "''",
      display: 'block',
      position: 'absolute',
      top: '1px',
      bottom: '1px',
      width: '3px',
      left: spacing['--gf-spacing-x0-5'],
    },
  },
  // Compared to logsRowLevel we need to make error logs wider to accommodate the icon
  logsRowWithError: {
    maxWidth: `calc(${spacing['--gf-spacing-grid-size']} * 1.5)`,
  },
  logsRowMatchHighLight: {
    padding: 'inherit',
    color: components['--gf-components-text-highlight-text'],
    backgroundColor: components['--gf-components-text-highlight-background'],
  },
  logRows: {
    position: 'relative',
  },
  shortcut: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing['--gf-spacing-x1'],
    color: colors['--gf-colors-text-secondary'],
    opacity: 0.7,
    fontSize: typography['--gf-typography-body-small-font-size'],
    marginTop: spacing['--gf-spacing-x1'],
  },
  logsRowsTable: {
    fontFamily: typography['--gf-typography-font-family-monospace'],
    fontSize: typography['--gf-typography-body-small-font-size'],
    width: '100%',
    position: 'relative',
  },
  logsRowsTableContain: {
    contain: 'strict',
  },
  highlightBackground: {
    backgroundColor: {
      default: logRowVars['--gf-logs-row-highlight-background'],
      ':hover': logRowVars['--gf-logs-row-hover-background'],
    },
  },
  logsRow: {
    width: '100%',
    cursor: 'pointer',
    verticalAlign: 'top',
    outlineStyle: { default: null, ':focus-within': 'solid' },
    outlineWidth: { default: null, ':focus-within': '2px' },
    outlineColor: { default: null, ':focus-within': colors['--gf-colors-primary-border'] },
    outlineOffset: { default: null, ':focus-within': '-2px' },
    backgroundColor: { default: null, ':hover': logRowVars['--gf-logs-row-hover-background'] },
  },
  logsRowDuplicates: {
    textAlign: 'right',
    width: '4em',
    cursor: 'default',
  },
  logIconError: {
    color: colors['--gf-colors-warning-main'],
    position: 'relative',
    top: '-2px',
  },
  logIconInfo: {
    color: colors['--gf-colors-info-main'],
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
  },
  logsRowMessage: {
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
    overflowWrap: 'anywhere',
    width: '100%',
    textAlign: 'left',
  },
  //Log details specific CSS
  logDetailsContainer: {
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-medium'],
    paddingTop: 0,
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: spacing['--gf-spacing-x1'],
    borderRadius: shape['--gf-shape-radius-default'],
    marginTop: `calc(${spacing['--gf-spacing-grid-size']} * 2.5)`,
    marginRight: spacing['--gf-spacing-x1'],
    marginBottom: `calc(${spacing['--gf-spacing-grid-size']} * 2.5)`,
    marginLeft: spacing['--gf-spacing-x2'],
    cursor: 'default',
  },
  logDetailsTable: {
    lineHeight: '18px',
    width: '100%',
  },
  logsDetailsIcon: {
    position: 'relative',
    color: v1['--gf-v1-palette-gray3'],
    paddingTop: '1px',
    paddingBottom: '1px',
    paddingRight: `calc(${spacing['--gf-spacing-grid-size']} * 0.75)`,
  },
  logDetailsLabel: {
    maxWidth: '30em',
    paddingTop: 0,
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: 0,
    paddingLeft: spacing['--gf-spacing-x1'],
    overflowWrap: 'break-word',
  },
  logDetailsHeading: {
    fontWeight: typography['--gf-typography-font-weight-bold'],
    paddingTop: spacing['--gf-spacing-x1'],
    paddingRight: 0,
    paddingBottom: spacing['--gf-spacing-x0-5'],
    paddingLeft: 0,
  },
  logDetailsValue: {
    position: 'relative',
    verticalAlign: 'middle',
    cursor: 'default',
    backgroundColor: { default: null, ':hover': logRowVars['--gf-logs-row-hover-background'] },
  },
  detailsToggle: {
    appearance: 'none',
    backgroundColor: 'transparent',
    backgroundImage: 'none',
    borderStyle: 'none',
    padding: 0,
    // Don't increase the height of the row
    maxHeight: '19px',
    // Don't show default button box-shadow on focus, we apply outline to the entire row instead
    boxShadow: { default: null, ':focus-visible': 'none' },
    outlineStyle: { default: null, ':focus': 'none' },
    outlineWidth: { default: null, ':focus': 0 },
    '::after': {
      content: '""',
      inset: 0,
      position: 'absolute',
    },
  },
  // Log row
  topVerticalAlign: {
    marginTop: `calc(${spacing['--gf-spacing-grid-size']} * -0.9)`,
    marginLeft: `calc(${spacing['--gf-spacing-grid-size']} * -0.25)`,
  },
  errorLogRow: {
    color: colors['--gf-colors-text-secondary'],
  },
  // Log Row Message
  positionRelative: {
    position: 'relative',
  },
  horizontalScroll: {
    whiteSpace: 'pre',
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
    backgroundColor: colors['--gf-colors-background-primary'],
    boxShadow: shadows['--gf-shadows-z3'],
    paddingTop: spacing['--gf-spacing-x0-5'],
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x0-5'],
    paddingLeft: spacing['--gf-spacing-x1'],
    zIndex: 100,
    gap: spacing['--gf-spacing-x0-5'],
    // The menu is the only child of logRowMenuCell.
    transform: 'translateX(-100%)',
  },
  logRowMenuCell: {
    position: 'sticky',
    zIndex: zIndex.dropdown,
    marginTop: `calc(${spacing['--gf-spacing-grid-size']} * -0.125)`,
    right: 0,
  },
  logLine: {
    fontFamily: typography['--gf-typography-font-family-monospace'],
    fontSize: typography['--gf-typography-body-small-font-size'],
    letterSpacing: typography['--gf-typography-body-small-letter-spacing'],
    textAlign: 'left',
    padding: 0,
    userSelect: 'text',
  },
  // Log details
  logsRowLevelDetails: {
    '::after': {
      top: '-3px',
    },
  },
  logDetails: {
    cursor: 'default',
    backgroundColor: { default: null, ':hover': colors['--gf-colors-background-primary'] },
  },
  unPinButton: {
    height: spacing['--gf-spacing-x3'],
    lineHeight: `calc(${spacing['--gf-spacing-grid-size']} * 2.5)`,
  },
});

export type LogRowStyles = typeof logRowStyles;
