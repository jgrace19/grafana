// Copyright (c) 2017 Uber Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { accordianLogsStyles } from './AccordianLogs.stylex';
import { sortBy as _sortBy } from 'lodash';
import * as React from 'react';

import { Trans } from '@grafana/i18n';
import { Counter, Icon, useStyles2 } from '@grafana/ui';

import { autoColor } from '../../Theme';
import { formatDuration } from '../../utils/date';

import AccordianKeyValues from './AccordianKeyValues';

import { alignIcon } from '.';

;

export type AccordianLogsProps = {
  interactive?: boolean;
  isOpen: boolean;
  logs: TraceLog[];
  onItemToggle?: (log: TraceLog) => void;
  onToggle?: () => void;
  openedItems?: Set<TraceLog>;
  timestamp: number;
};

export default function AccordianLogs({
  interactive = true,
  isOpen,
  logs,
  openedItems,
  onItemToggle,
  onToggle,
  timestamp,
}: AccordianLogsProps) {
  let arrow: React.ReactNode | null = null;
  let HeaderComponent: 'span' | 'a' = 'span';
  let headerProps: {} | null = null;
  if (interactive) {
    arrow = isOpen ? (
      <Icon name={'angle-down'} className={alignIcon} />
    ) : (
      <Icon name={'angle-right'} className="u-align-icon" style={{ margin: '0 0.25rem 0 0' }} />
    );
    HeaderComponent = 'a';
    headerProps = {
      'aria-checked': isOpen,
      onClick: onToggle,
      role: 'switch',
    };
  }
  return (
    <div {...stylex.props(accordianLogsStyles.AccordianLogs)}>
      <HeaderComponent {...stylex.props(accordianLogsStyles.AccordianLogsHeader)} {...headerProps}>
        {arrow}{' '}
        <strong>
          <Trans i18nKey="explore.accordian-logs.events">Events</Trans>
        </strong>{' '}
        <Counter value={logs.length} variant="secondary" />
      </HeaderComponent>
      {isOpen && (
        <div {...stylex.props(accordianLogsStyles.AccordianLogsContent)}>
          {_sortBy(logs, 'timestamp').map((log, i) => {
            const formattedDuration = formatDuration(log.timestamp - timestamp);
            const truncateLogNameInSummary = log.name && log.name.length > 20;
            const formattedLogName = log.name && truncateLogNameInSummary ? log.name.slice(0, 20) + '...' : log.name;
            const label = formattedLogName ? (
              <span>
                {formattedDuration} <span>({formattedLogName})</span>
              </span>
            ) : (
              formattedDuration
            );
            return (
              <AccordianKeyValues
                // `i` is necessary in the key because timestamps can repeat
                key={`${log.timestamp}-${i}`}
                className={i < logs.length - 1 ? mergeStylexClassName(stylex.props(accordianLogsStyles.AccordianKeyValuesItem), undefined).className : null}
                data={log.fields || []}
                logName={truncateLogNameInSummary ? log.name : undefined}
                highContrast
                interactive={interactive}
                isOpen={openedItems ? openedItems.has(log) : false}
                label={label}
                onToggle={interactive && onItemToggle ? () => onItemToggle(log) : null}
              />
            );
          })}
          <small {...stylex.props(accordianLogsStyles.AccordianLogsFooter)}>
            <Trans i18nKey="explore.accordian-logs.footer">
              Event timestamps are relative to the start time of the full trace.
            </Trans>
          </small>
        </div>
      )}
    </div>
  );
}
