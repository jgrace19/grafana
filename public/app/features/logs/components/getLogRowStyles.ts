import * as stylex from '@stylexjs/stylex';
import memoizeOne from 'memoize-one';
import tinycolor from 'tinycolor2';

import { colorManipulator, LogLevel, type GrafanaTheme2 } from '@grafana/data';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { styleMixins } from '@grafana/ui';

import { logRowStyles } from './getLogRowStyles.stylex';

const cn = (key: keyof typeof logRowStyles, ...overrides: stylex.StyleXStyles[]) =>
  mergeStylexClassName(stylex.props(logRowStyles[key], ...overrides), undefined).className ?? '';

export const getLogLevelStyles = (theme: GrafanaTheme2, logLevel?: LogLevel) => {
  let logColor = theme.isLight ? theme.v1.palette.gray5 : theme.v1.palette.gray2;
  switch (logLevel) {
    case LogLevel.crit:
    case LogLevel.critical:
      logColor = '#705da0';
      break;
    case LogLevel.error:
    case LogLevel.err:
      logColor = '#e24d42';
      break;
    case LogLevel.warning:
    case LogLevel.warn:
      logColor = theme.colors.warning.main;
      break;
    case LogLevel.info:
      logColor = '#7eb26d';
      break;
    case LogLevel.debug:
      logColor = '#1f78c1';
      break;
    case LogLevel.trace:
      logColor = '#6ed0e0';
      break;
  }

  return {
    logsRowLevelColor: cn('logsRowLevelColor', { '::after': { backgroundColor: logColor } }),
  };
};

export const getLogRowStyles = memoizeOne((theme: GrafanaTheme2) => {
  const hoverBgColor = styleMixins.hoverColor(theme.colors.background.secondary, theme);
  const contextOutlineColor = tinycolor(theme.components.dashboard.background).setAlpha(0.7).toRgbString();
  const highlightBackground = tinycolor(theme.colors.info.transparent).setAlpha(0.25).toString();

  return {
    logsRowLevel: cn('logsRowLevel'),
    logsRowWithError: cn('logsRowWithError'),
    logsRowMatchHighLight: cn('logsRowMatchHighLight', { color: theme.components.textHighlight.text, backgroundColor: theme.components.textHighlight.background }),
    logRows: cn('logRows'),
    shortcut: cn('shortcut'),
    logsRowsTable: cn('logsRowsTable'),
    logsRowsTableContain: cn('logsRowsTableContain'),
    highlightBackground: cn('highlightBackground', { backgroundColor: highlightBackground }),
    logsRow: cn('logsRow', { ':hover': { background: hoverBgColor } }),
    logsRowDuplicates: cn('logsRowDuplicates'),
    logIconError: cn('logIconError'),
    logIconInfo: cn('logIconInfo'),
    logsRowToggleDetails: cn('logsRowToggleDetails'),
    logsRowLocalTime: cn('logsRowLocalTime'),
    logsRowLabels: cn('logsRowLabels'),
    logsRowMessage: cn('logsRowMessage'),
    copyLogButton: cn('copyLogButton', { ':hover': { backgroundColor: colorManipulator.alpha(theme.colors.text.primary, 0.12) } }),
    logDetailsContainer: cn('logDetailsContainer'),
    logDetailsTable: cn('logDetailsTable'),
    logsDetailsIcon: cn('logsDetailsIcon', { color: theme.v1.palette.gray3 }),
    logDetailsLabel: cn('logDetailsLabel'),
    logDetailsHeading: cn('logDetailsHeading'),
    logDetailsValue: cn('logDetailsValue', { ':hover': { background: hoverBgColor } }),
    detailsToggle: cn('detailsToggle'),
    topVerticalAlign: cn('topVerticalAlign'),
    detailsOpen: cn('detailsOpen', { ':hover': { backgroundColor: styleMixins.hoverColor(theme.colors.background.primary, theme) } }),
    errorLogRow: cn('errorLogRow'),
    positionRelative: cn('positionRelative'),
    rowWithContext: cn('rowWithContext', { outline: `9999px solid ${contextOutlineColor}` }),
    horizontalScroll: cn('horizontalScroll'),
    contextNewline: cn('contextNewline'),
    rowMenu: cn('rowMenu'),
    logRowMenuCell: cn('logRowMenuCell'),
    logLine: cn('logLine'),
    logsRowLevelDetails: cn('logsRowLevelDetails'),
    logDetails: cn('logDetails'),
    visibleRowMenu: cn('visibleRowMenu'),
    linkButton: cn('linkButton'),
    hidden: cn('hidden'),
    unPinButton: cn('unPinButton'),
  };
});

export type LogRowStyles = ReturnType<typeof getLogRowStyles>;
