import * as stylex from '@stylexjs/stylex';
import { type CSSProperties, type ReactNode } from 'react';

import { mergeStylexProps } from '@grafana/ui/internal';

import { logLineStyles } from './LogLine';

interface Props {
  children: ReactNode;
  onClick?: () => void;
  style: CSSProperties;
}

export const LogLineMessage = ({ children, onClick, style }: Props) => {
  return (
    <div {...mergeStylexProps(stylex.props(logLineStyles.logLine, logLineStyles.logLineMessage), { style })}>
      {onClick ? (
        <button {...stylex.props(logLineStyles.loadMoreButton)} onClick={onClick}>
          {children}
        </button>
      ) : (
        children
      )}
    </div>
  );
};
