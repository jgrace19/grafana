import * as stylex from '@stylexjs/stylex';
import { memo, type ReactNode, type SyntheticEvent, useMemo, useState } from 'react';
import Highlighter from 'react-highlight-words';

import { type CoreApp, findHighlightChunksInText, type LogRowContextOptions, type LogRowModel } from '@grafana/data';
import { Trans } from '@grafana/i18n';
import { type DataQuery } from '@grafana/schema';
import { type PopoverContent, useTheme2 } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { colors, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

import { escapeUnescapedString } from '../utils';

import { LogMessageAnsi } from './LogMessageAnsi';
import { LogRowMenuCell } from './LogRowMenuCell';
import { logRowStyles } from './getLogRowStyles';

export const MAX_CHARACTERS = 100000;

interface Props {
  row: LogRowModel;
  wrapLogMessage: boolean;
  prettifyLogMessage: boolean;
  app?: CoreApp;
  showContextToggle?: (row: LogRowModel) => boolean;
  onOpenContext: (row: LogRowModel) => void;
  getRowContextQuery?: (
    row: LogRowModel,
    options?: LogRowContextOptions,
    cacheFilters?: boolean
  ) => Promise<DataQuery | null>;
  onPermalinkClick?: (row: LogRowModel) => Promise<void>;
  onPinLine?: (row: LogRowModel) => void;
  onUnpinLine?: (row: LogRowModel) => void;
  pinLineButtonTooltipTitle?: PopoverContent;
  pinned?: boolean;
  mouseIsOver: boolean;
  onBlur: () => void;
  expanded?: boolean;
  logRowMenuIconsBefore?: ReactNode[];
  logRowMenuIconsAfter?: ReactNode[];
  forceEscape?: boolean;
}

interface LogMessageProps {
  hasAnsi: boolean;
  entry: string;
  highlights: string[] | undefined;
}

const LogMessage = ({ hasAnsi, entry, highlights }: LogMessageProps) => {
  const excessCharacters = useMemo(() => entry.length - MAX_CHARACTERS, [entry]);
  const needsHighlighter =
    highlights && highlights.length > 0 && highlights[0] && highlights[0].length > 0 && excessCharacters <= 0;
  const searchWords = highlights ?? [];
  const [showFull, setShowFull] = useState(excessCharacters < 0);
  const truncatedEntry = useMemo(() => (showFull ? entry : entry.substring(0, MAX_CHARACTERS)), [entry, showFull]);

  if (hasAnsi) {
    const highlight = needsHighlighter ? { searchWords, highlightClassName: matchHighlightClassName } : undefined;
    return <LogMessageAnsi value={truncatedEntry} highlight={highlight} />;
  } else if (needsHighlighter) {
    return (
      <Highlighter
        textToHighlight={truncatedEntry}
        searchWords={searchWords}
        findChunks={findHighlightChunksInText}
        highlightClassName={matchHighlightClassName}
      />
    );
  }
  return (
    <>
      {truncatedEntry}
      {!showFull && <Ellipsis showFull={showFull} toggle={setShowFull} diff={excessCharacters} />}
    </>
  );
};

interface EllipsisProps {
  showFull: boolean;
  toggle(state: boolean): void;
  diff: number;
}
const Ellipsis = ({ toggle, diff }: EllipsisProps) => {
  const theme = useTheme2();
  const handleClick = (e: SyntheticEvent) => {
    e.stopPropagation();
    toggle(true);
  };
  return (
    <>
      <Trans i18nKey="logs.log-row-message.ellipsis">… </Trans>
      <button
        {...stylex.props(
          ellipsisStyles.showMore,
          ellipsisStyles.borderColor(theme.colors.emphasize(theme.colors.border.strong, 0.25))
        )}
        onClick={handleClick}
      >
        {diff} <Trans i18nKey="logs.log-row-message.more">more</Trans>
      </button>
    </>
  );
};

const restructureLog = (
  row: LogRowModel,
  prettifyLogMessage: boolean,
  wrapLogMessage: boolean,
  expanded: boolean,
  forceEscape: boolean
): string => {
  let line = row.raw;
  if (prettifyLogMessage) {
    try {
      line = JSON.stringify(JSON.parse(line), undefined, 2);
      return row.hasUnescapedContent && forceEscape ? escapeUnescapedString(line) : line;
    } catch (error) {}
  }
  if (row.hasUnescapedContent && forceEscape) {
    line = escapeUnescapedString(line);
  }
  // With wrapping disabled, we want to turn it into a single-line log entry unless the line is expanded
  if (!wrapLogMessage && !expanded) {
    line = line.replace(/(\r\n|\n|\r)/g, '');
  }
  return line;
};

export const LogRowMessage = memo((props: Props) => {
  const {
    row,
    wrapLogMessage,
    prettifyLogMessage,
    showContextToggle,
    onOpenContext,
    onPermalinkClick,
    onUnpinLine,
    onPinLine,
    pinLineButtonTooltipTitle,
    pinned,
    mouseIsOver,
    onBlur,
    getRowContextQuery,
    expanded,
    logRowMenuIconsBefore,
    logRowMenuIconsAfter,
    forceEscape,
  } = props;
  const { hasAnsi } = row;
  const restructuredEntry = useMemo(
    () => restructureLog(row, prettifyLogMessage, wrapLogMessage, Boolean(expanded), Boolean(forceEscape)),
    [expanded, forceEscape, prettifyLogMessage, row, wrapLogMessage]
  );
  const shouldShowMenu = mouseIsOver || pinned;

  return (
    <>
      {
        // When context is open, the position has to be NOT relative. // Setting the postion as inline-style to
        // overwrite the more sepecific style definition from `styles.logsRowMessage`.
      }
      <td {...stylex.props(logRowStyles.logsRowMessage)}>
        <div {...stylex.props(wrapLogMessage ? logRowStyles.positionRelative : logRowStyles.horizontalScroll)}>
          <div {...stylex.props(logRowStyles.logLine, logRowStyles.positionRelative)}>
            <LogMessage hasAnsi={hasAnsi} entry={restructuredEntry} highlights={row.searchWords} />
          </div>
        </div>
      </td>
      <td {...mergeStylexProps(stylex.props(logRowStyles.logRowMenuCell), { className: 'log-row-menu-cell' })}>
        {shouldShowMenu && (
          <LogRowMenuCell
            logText={restructuredEntry}
            row={row}
            showContextToggle={showContextToggle}
            getRowContextQuery={getRowContextQuery}
            onOpenContext={onOpenContext}
            onPermalinkClick={onPermalinkClick}
            onPinLine={onPinLine}
            onUnpinLine={onUnpinLine}
            pinLineButtonTooltipTitle={pinLineButtonTooltipTitle}
            pinned={pinned}
            mouseIsOver={mouseIsOver}
            onBlur={onBlur}
            addonBefore={logRowMenuIconsBefore}
            addonAfter={logRowMenuIconsAfter}
          />
        )}
      </td>
    </>
  );
});

LogRowMessage.displayName = 'LogRowMessage';

const matchHighlightClassName = stylex.props(logRowStyles.logsRowMatchHighLight).className ?? '';

const ellipsisStyles = stylex.create({
  showMore: {
    backgroundColor: { default: 'transparent', ':hover': colors['--gf-colors-secondary-transparent'] },
    display: 'inline-flex',
    fontWeight: typography['--gf-typography-font-weight-medium'],
    fontSize: typography['--gf-typography-size-sm'],
    fontFamily: typography['--gf-typography-font-family'],
    height: spacing['--gf-spacing-x3'],
    paddingTop: spacing['--gf-spacing-x0-25'],
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x0-25'],
    paddingLeft: spacing['--gf-spacing-x1'],
    color: colors['--gf-colors-secondary-text'],
    borderWidth: '1px',
    borderStyle: 'solid',
  },
  borderColor: (hoverColor: string) => ({
    borderColor: { default: colors['--gf-colors-border-strong'], ':hover': hoverColor },
  }),
});
