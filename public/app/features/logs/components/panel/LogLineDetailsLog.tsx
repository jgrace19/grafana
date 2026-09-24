import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { logLineDetailsLogStyles } from './LogLineDetailsLog.stylex';
import { memo, useMemo } from 'react';


import { LogMessageAnsi } from '../LogMessageAnsi';

import { HighlightedLogRenderer } from './HighlightedLogRenderer';
import { getStyles } from './LogLine';
import { useLogListContext } from './LogListContext';
import { type LogListModel } from './processing';

interface Props {
  log: LogListModel;
  syntaxHighlighting: boolean;
}

export const LogLineDetailsLog = memo(({ log: originalLog, syntaxHighlighting }: Props) => {
  const { fontSize } = useLogListContext();
  const logStyles = useStyles2(getStyles);
  const log = useMemo(() => {
    const log = originalLog.clone();
    return log;
  }, [originalLog]);

  return (
    <div {...stylex.props(logLineDetailsLogStyles.logLineWrapper)}>
      <div className={`${logStyles.logLine} ${fontSize === 'small' ? logStyles.fontSizeSmall : ''} ${mergeStylexClassName(stylex.props(logLineDetailsLogStyles.noHover), undefined).className}`}>
        <div className={logStyles.wrappedLogLine}>
          {log.hasAnsi ? (
            <span className="field no-highlighting">
              <LogMessageAnsi value={log.body} />
            </span>
          ) : (
            <>
              {!syntaxHighlighting && <div className="field no-highlighting">{log.body}</div>}
              {syntaxHighlighting && (
                <div className="field log-syntax-highlight">
                  {<HighlightedLogRenderer tokens={log.highlightedBodyTokens} />}
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

