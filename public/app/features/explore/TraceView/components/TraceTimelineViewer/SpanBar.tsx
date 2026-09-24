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
import { groupBy as _groupBy } from 'lodash';
import { useState } from 'react';
import * as React from 'react';

import { selectors } from '@grafana/e2e-selectors';
import { Trans } from '@grafana/i18n';
import { Tooltip } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { shape } from '@grafana/ui/stylex/tokens.stylex';

import { Popover } from '../common/Popover';
import { spanBarRowMarker } from '../markers.stylex';
import { traceColors } from '../traceColors.stylex';
import type TNil from '../types/TNil';
import { type TraceSpan, type CriticalPathSection } from '../types/trace';

import AccordianLogs from './SpanDetail/AccordianLogs';
import { type ViewedBoundsFunctionType } from './utils';

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
  /** Which side of the bar the label sits on. */
  labelPosition?: 'left' | 'right';
  /** Darkens the label, as a hovered, expanded or focused row does. */
  isLabelHighlighted?: boolean;
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
  labelPosition,
  isLabelHighlighted = false,
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
      {...mergeStylexProps(stylex.props(styles.wrapper), { className })}
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
        {...mergeStylexProps(stylex.props(styles.bar), {
          style: {
            background: color,
            left: toPercent(viewStart),
            width: toPercent(viewEnd - viewStart),
          },
        })}
      >
        <div
          {...mergeStylexProps(
            stylex.props(
              styles.label,
              isLabelHighlighted && styles.labelHighlighted,
              labelPosition === 'left' && styles.labelLeft,
              labelPosition === 'right' && styles.labelRight
            ),
            { className: labelClassName }
          )}
          data-testid="SpanBar--label"
        >
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
            <div
              data-testid="SpanBar--logMarker"
              {...mergeStylexProps(stylex.props(styles.logMarker), { style: { left: positionKey } })}
            />
          </Popover>
        ))}
      </div>
      {rpc && (
        <div
          {...mergeStylexProps(stylex.props(styles.rpc), {
            style: {
              background: rpc.color,
              left: toPercent(rpc.viewStart),
              width: toPercent(rpc.viewEnd - rpc.viewStart),
            },
          })}
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
              {...mergeStylexProps(stylex.props(styles.criticalPath), {
                style: {
                  left: toPercentInDecimal(criticalPathViewStart),
                  width: toPercentInDecimal(criticalPathViewEnd - criticalPathViewStart),
                },
              })}
            />
          </Tooltip>
        );
      })}
    </div>
  );
}

export default React.memo(SpanBar);

const styles = stylex.create({
  wrapper: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    overflow: 'hidden',
    zIndex: 0,
  },
  bar: {
    borderRadius: shape['--gf-shape-radius-sm'],
    minWidth: '2px',
    position: 'absolute',
    height: '40%',
    top: '30%',
  },
  rpc: {
    position: 'absolute',
    top: '35%',
    bottom: '35%',
    zIndex: 1,
  },
  label: {
    color: { default: '#aaa', [stylex.when.ancestor(':hover', spanBarRowMarker)]: traceColors['--gf-trace-000'] },
    fontSize: '12px',
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans - serif",
    lineHeight: '1em',
    whiteSpace: 'nowrap',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: '0.5em',
    paddingRight: '0.5em',
    position: 'absolute',
  },
  labelHighlighted: {
    color: traceColors['--gf-trace-000'],
  },
  labelRight: {
    left: '100%',
  },
  labelLeft: {
    right: '100%',
  },
  logMarker: {
    backgroundColor: { default: traceColors['--gf-trace-2c3235'], ':hover': traceColors['--gf-trace-464c54'] },
    cursor: 'pointer',
    height: '60%',
    minWidth: '1px',
    position: 'absolute',
    top: '20%',
    '::before': {
      content: "''",
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'transparent',
    },
    '::after': {
      content: "''",
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'transparent',
    },
  },
  criticalPath: {
    position: 'absolute',
    top: '44%',
    height: '11%',
    zIndex: 2,
    overflow: 'hidden',
    backgroundColor: traceColors['--gf-trace-f1f1f1'],
    borderLeftWidth: '1px',
    borderLeftStyle: 'solid',
    borderLeftColor: traceColors['--gf-trace-2c3235'],
    borderRightWidth: '1px',
    borderRightStyle: 'solid',
    borderRightColor: traceColors['--gf-trace-2c3235'],
  },
});
