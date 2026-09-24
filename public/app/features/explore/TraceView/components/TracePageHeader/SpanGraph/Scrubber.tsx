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

import { scrubberHandlesMarker } from '../../markers.stylex';

export type ScrubberProps = {
  isDragging: boolean;
  position: number;
  onMouseDown: (evt: React.MouseEvent<SVGGElement>) => void;
  onMouseEnter: (evt: React.MouseEvent<SVGGElement>) => void;
  onMouseLeave: (evt: React.MouseEvent<SVGGElement>) => void;
};

export default function Scrubber({ isDragging, onMouseDown, onMouseEnter, onMouseLeave, position }: ScrubberProps) {
  const xPercent = `${position * 100}%`;
  return (
    <g data-testid="scrubber-component">
      <g
        data-testid="scrubber-component-g"
        {...stylex.props(scrubberHandlesMarker)}
        onMouseDown={onMouseDown}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* handleExpansion is only visible when `isDragging` is true */}
        <rect
          data-testid="scrubber-component-rect-1"
          x={xPercent}
          {...mergeStylexProps(
            stylex.props(styles.ScrubberHandleExpansion, isDragging && styles.ScrubberHandleExpansionDragging),
            { style: { transform: `translate(-4.5px)` } }
          )}
          width="9"
          height="20"
        />
        <rect
          data-testid="scrubber-component-rect-2"
          x={xPercent}
          {...mergeStylexProps(stylex.props(styles.ScrubberHandle, isDragging && styles.ScrubberHandleDragging), {
            style: { transform: `translate(-1.5px)` },
          })}
          width="3"
          height="20"
        />
      </g>
      <line
        {...stylex.props(styles.ScrubberLine, isDragging && styles.ScrubberLineDragging)}
        y2="100%"
        x1={xPercent}
        x2={xPercent}
        data-testid="scrubber-component-line"
      />
    </g>
  );
}

const styles = stylex.create({
  ScrubberHandleExpansion: {
    cursor: 'col-resize',
    fillOpacity: { default: 0, [stylex.when.ancestor(':hover', scrubberHandlesMarker)]: 1 },
    fill: '#44f',
  },
  ScrubberHandleExpansionDragging: {
    fillOpacity: 1,
  },
  ScrubberHandle: {
    cursor: 'col-resize',
    fill: { default: '#555', [stylex.when.ancestor(':hover', scrubberHandlesMarker)]: '#44f' },
  },
  ScrubberHandleDragging: {
    fill: '#44f',
  },
  ScrubberLine: {
    pointerEvents: 'none',
    stroke: '#555',
  },
  ScrubberLineDragging: {
    stroke: '#44f',
  },
});
