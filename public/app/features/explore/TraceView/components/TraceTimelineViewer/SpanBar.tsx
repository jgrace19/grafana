import clsx from 'clsx';
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
import { spanBarStyles } from './SpanBar.stylex';
import cx from 'classnames';
import { groupBy as _groupBy } from 'lodash';
import { useState } from 'react';
import * as React from 'react';

import { selectors } from '@grafana/e2e-selectors';
import { Trans } from '@grafana/i18n';
import { Tooltip, useStyles2 } from '@grafana/ui';

import { autoColor } from '../Theme';
import { Popover } from '../common/Popover';
import type TNil from '../types/TNil';
import { type TraceSpan, type CriticalPathSection } from '../types/trace';

import AccordianLogs from './SpanDetail/AccordianLogs';
import { type ViewedBoundsFunctionType } from './utils';

;

export type Props = {
  color: string;
  onClick?: (evt: React.MouseEvent<HTMLDivElement>) => void;
  viewEnd: number;
  viewStart: number;
  getViewedBounds: ViewedBoundsFunctionType;
  rpc:
    | {
        viewStart: number;
        viewEnd: number;
        color: string;
      }
    | TNil;
  traceStartTime: number;
  span: TraceSpan;
  className?: string;
  labelClassName?: string;
  longLabel: string;
  shortLabel: string;
  criticalPath: CriticalPathSection[];
};

function toPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

function toPercentInDecimal(value: number) {
  return `${value * 100}%`;
}

function SpanBar({
  criticalPath,
  viewEnd,
  viewStart,
  getViewedBounds,
  color,
  shortLabel,
  longLabel,
  onClick,
  rpc,
  traceStartTime,
  span,
  className,
  labelClassName,
}: Props) {
  const [label, setLabel] = useState(shortLabel);
  const setShortLabel = () => setLabel(shortLabel);
  const setLongLabel = () => setLabel(longLabel);

  // group logs based on timestamps
  const logGroups = _groupBy(span.logs, (log) => {
    const posPercent = getViewedBounds(log.timestamp, log.timestamp).start;
    // round to the nearest 0.2%
    return toPercent(Math.round(posPercent * 500) / 500);
  });

  return (
    <div
      {...mergeStylexClassName(stylex.props(spanBarStyles.wrapper, , className), undefined)}
      onBlur={setShortLabel}
      onClick={onClick}
      onFocus={setLongLabel}
      onMouseOut={setShortLabel}
      onMouseOver={setLongLabel}
      aria-hidden
      data-testid={selectors.components.TraceViewer.spanBar}
    >
      <div
        aria-label={label}
        {...mergeStylexClassName(stylex.props(spanBarStyles.bar, ), undefined)}
        style={{
          background: color,
          left: toPercent(viewStart),
          width: toPercent(viewEnd - viewStart),
        }}
      >
        <div {...mergeStylexClassName(stylex.props(spanBarStyles.label, , labelClassName), undefined)} data-testid="SpanBar--label">
          {label}
        </div>
      </div>
      <div>
        {Object.keys(logGroups).map((positionKey) => (
          <Popover
            key={positionKey}
            content={
              <AccordianLogs interactive={false} isOpen logs={logGroups[positionKey]} timestamp={traceStartTime} />
            }
          >
            <div data-testid="SpanBar--logMarker" {...mergeStylexClassName(stylex.props(spanBarStyles.logMarker, ), undefined)} style={{ left: positionKey }} />
          </Popover>
        ))}
      </div>
      {rpc && (
        <div
          {...mergeStylexClassName(stylex.props(spanBarStyles.rpc, ), undefined)}
          style={{
            background: rpc.color,
            left: toPercent(rpc.viewStart),
            width: toPercent(rpc.viewEnd - rpc.viewStart),
          }}
        />
      )}
      {criticalPath?.map((each, index) => {
        const critcalPathViewBounds = getViewedBounds(each.section_start, each.section_end);
        const criticalPathViewStart = critcalPathViewBounds.start;
        const criticalPathViewEnd = critcalPathViewBounds.end;
        const key = `${each.spanId}-${index}`;
        return (
          <Tooltip
            key={key}
            placement="top"
            content={
              <div>
                <Trans i18nKey="explore.span-bar.tooltip-critical-path">
                  A segment on the <em>critical path</em> of the overall trace / request / workflow.
                </Trans>
              </div>
            }
          >
            <div
              data-testid="SpanBar--criticalPath"
              {...stylex.props(spanBarStyles.criticalPath)}
              style={{
                left: toPercentInDecimal(criticalPathViewStart),
                width: toPercentInDecimal(criticalPathViewEnd - criticalPathViewStart),
              }}
            />
          </Tooltip>
        );
      })}
    </div>
  );
}

export default React.memo(SpanBar);
