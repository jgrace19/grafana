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

import { mergeStylexProps } from '@grafana/ui/internal';

import { formatDuration } from '../../utils/date';

type TickLabelsProps = {
  numTicks: number;
  duration: number;
};

export default function TickLabels(props: TickLabelsProps) {
  const { numTicks, duration } = props;

  const ticks = [];
  for (let i = 0; i < numTicks + 1; i++) {
    const portion = i / numTicks;
    const style = portion === 1 ? { right: '0%' } : { left: `${portion * 100}%` };
    ticks.push(
      <div key={portion} {...mergeStylexProps(stylex.props(styles.TickLabelsLabel), { style })} data-testid="tick">
        {formatDuration(duration * portion)}
      </div>
    );
  }

  return (
    <div {...stylex.props(styles.TickLabels)} data-testid="TickLabels">
      {ticks}
    </div>
  );
}

const styles = stylex.create({
  TickLabels: {
    height: '1rem',
    position: 'relative',
  },
  TickLabelsLabel: {
    color: '#717171',
    fontSize: '0.7rem',
    position: 'absolute',
    userSelect: 'none',
  },
});
