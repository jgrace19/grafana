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
import * as React from 'react';

import { mergeStylexProps } from '@grafana/ui/internal';

import { traceColors } from '../traceColors.stylex';
import type TNil from '../types/TNil';
import { formatDuration } from '../utils/date';

type TicksProps = {
  endTime?: number | TNil;
  numTicks: number;
  showLabels?: boolean | TNil;
  startTime?: number | TNil;
};

export default function Ticks({ endTime = null, numTicks, showLabels = null, startTime = null }: TicksProps) {
  let labels: undefined | string[];
  if (showLabels) {
    labels = [];
    const viewingDuration = (endTime || 0) - (startTime || 0);
    for (let i = 0; i < numTicks; i++) {
      const durationAtTick = (startTime || 0) + (i / (numTicks - 1)) * viewingDuration;
      labels.push(formatDuration(durationAtTick));
    }
  }
  const ticks: React.ReactNode[] = [];
  for (let i = 0; i < numTicks; i++) {
    const portion = i / (numTicks - 1);
    ticks.push(
      <div
        data-testid="TicksID"
        key={portion}
        {...mergeStylexProps(stylex.props(styles.TicksTick), { style: { left: `${portion * 100}%` } })}
      >
        {labels && (
          <span {...stylex.props(styles.TicksTickLabel, portion >= 1 && styles.TicksTickLabelEndAnchor)}>
            {labels[i]}
          </span>
        )}
      </div>
    );
  }
  return <div {...stylex.props(styles.Ticks)}>{ticks}</div>;
}

const styles = stylex.create({
  Ticks: {
    pointerEvents: 'none',
  },
  TicksTick: {
    position: 'absolute',
    height: '100%',
    width: { default: '1px', ':last-child': 0 },
    backgroundColor: traceColors['--gf-trace-d8d8d8'],
  },
  TicksTickLabel: {
    left: '0.25rem',
    position: 'absolute',
    whiteSpace: 'nowrap',
  },
  TicksTickLabelEndAnchor: {
    left: 'initial',
    right: '0.25rem',
  },
});
