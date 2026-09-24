import * as stylex from '@stylexjs/stylex';
import { memo, useMemo } from 'react';

import { useTheme2 } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';

import { LogMessageAnsi } from '../LogMessageAnsi';

import { HighlightedLogRenderer } from './HighlightedLogRenderer';
import { getLogLineVarStyles, logLineStyles } from './LogLine';
import { useLogListContext } from './LogListContext';
import { type LogListModel } from './processing';

interface Props {
  log: LogListModel;
  syntaxHighlighting: boolean;
}

export const LogLineDetailsLog = memo(({ log: originalLog, syntaxHighlighting }: Props) => {
  const { fontSize } = useLogListContext();
  const theme = useTheme2();
  const varStyles = useMemo(() => getLogLineVarStyles(theme), [theme]);
  const log = useMemo(() => {
    const log = originalLog.clone();
    return log;
  }, [originalLog]);

  return (
    <div {...stylex.props(styles.logLineWrapper, varStyles)}>
      <div
        {...stylex.props(logLineStyles.logLine, fontSize === 'small' && logLineStyles.fontSizeSmall, styles.noHover)}
      >
        <div {...stylex.props(logLineStyles.wrappedLogLine)}>
          {log.hasAnsi ? (
            <span
              {...mergeStylexProps(stylex.props(logLineStyles.noHighlighting, logLineStyles.wrappedField), {
                className: 'field no-highlighting',
              })}
            >
              <LogMessageAnsi value={log.body} />
            </span>
          ) : (
            <>
              {!syntaxHighlighting && (
                <div
                  {...mergeStylexProps(stylex.props(logLineStyles.noHighlighting, logLineStyles.wrappedField), {
                    className: 'field no-highlighting',
                  })}
                >
                  {log.body}
                </div>
              )}
              {syntaxHighlighting && (
                <div
                  {...mergeStylexProps(stylex.props(logLineStyles.wrappedField), {
                    className: 'field log-syntax-highlight',
                  })}
                >
                  {<HighlightedLogRenderer tokens={log.highlightedBodyTokens} colorTokens />}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
});

LogLineDetailsLog.displayName = 'LogLineDetailsLog';

const styles = stylex.create({
  logLineWrapper: {
    maxHeight: '50vh',
    overflow: 'auto',
  },
  noHover: {
    // Disable hover style
    pointerEvents: 'none',
  },
});
