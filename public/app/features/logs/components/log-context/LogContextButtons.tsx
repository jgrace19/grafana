import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { logContextButtonsStyles } from './LogContextButtons.stylex';
import { useCallback } from 'react';
import * as React from 'react';

import { Trans, t } from '@grafana/i18n';
import { reportInteraction } from '@grafana/runtime';
import { Button, InlineSwitch } from '@grafana/ui';

export type Props = {
  wrapLines?: boolean;
  onChangeWrapLines: (wrapLines: boolean) => void;
  onScrollCenterClick: () => void;
};


export const LogContextButtons = (props: Props) => {
  const { wrapLines, onChangeWrapLines, onScrollCenterClick } = props;
  const internalOnChangeWrapLines = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      const state = event.currentTarget.checked;
      reportInteraction('grafana_explore_logs_log_context_toggle_lines_clicked', {
        state,
      });
      onChangeWrapLines(state);
    },
    [onChangeWrapLines]
  );

  return (
    <div {...stylex.props(logContextButtonsStyles.buttons)}>
      <InlineSwitch
        showLabel
        value={wrapLines}
        onChange={internalOnChangeWrapLines}
        label={t('logs.log-context-buttons.label-wrap-lines', 'Wrap lines')}
      />
      <Button variant="secondary" onClick={onScrollCenterClick}>
        <Trans i18nKey="logs.log-context-buttons.center-matched-line">Center matched line</Trans>
      </Button>
    </div>
  );
};
