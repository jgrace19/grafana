import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { panelHeaderNoticeStyles } from './PanelHeaderNotice.stylex';
import * as React from 'react';

import { Icon, ToolbarButton, Tooltip, useStyles2 } from '@grafana/ui';
import { getFocusStyles, getMouseFocusStyles } from '@grafana/ui/internal';

interface Props {
  notice: QueryResultMetaNotice;
  onClick: (e: React.SyntheticEvent, tab: string) => void;
}

export const PanelHeaderNotice = ({ notice, onClick }: Props) => {

  const iconName =
    notice.severity === 'error' || notice.severity === 'warning' ? 'exclamation-triangle' : 'file-landscape-alt';

  if (notice.inspect && onClick) {
    return (
      <ToolbarButton
        {...stylex.props(panelHeaderNoticeStyles.notice)}
        icon={iconName}
        iconSize="md"
        key={notice.severity}
        tooltip={notice.text}
        onClick={(e) => onClick(e, notice.inspect!)}
      />
    );
  }

  if (notice.link) {
    return (
      <a {...stylex.props(panelHeaderNoticeStyles.notice)} aria-label={notice.text} href={notice.link} target="_blank" rel="noreferrer">
        <Icon name={iconName} style={{ marginRight: '8px' }} size="md" />
      </a>
    );
  }

  return (
    <Tooltip key={notice.severity} content={notice.text}>
      <span {...stylex.props(panelHeaderNoticeStyles.iconTooltip)}>
        <Icon name={iconName} size="md" />
      </span>
    </Tooltip>
  );
};

