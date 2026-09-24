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
import { scrubberStyles } from './Scrubber.stylex';
import cx from 'classnames';
import * as React from 'react';


export 
export type ScrubberProps = {
  isDragging: boolean;
  position: number;
  onMouseDown: (evt: React.MouseEvent<SVGGElement>) => void;
  onMouseEnter: (evt: React.MouseEvent<SVGGElement>) => void;
  onMouseLeave: (evt: React.MouseEvent<SVGGElement>) => void;
};

export default function Scrubber({ isDragging, onMouseDown, onMouseEnter, onMouseLeave, position }: ScrubberProps) {
  const xPercent = `${position * 100}%`;
  const className = clsx({ [mergeStylexClassName(stylex.props(scrubberStyles.ScrubberDragging), undefined).className]: isDragging });
  return (
    <g className={className} data-testid="scrubber-component">
      <g
        data-testid="scrubber-component-g"
        {...stylex.props(scrubberStyles.ScrubberHandles)}
        onMouseDown={onMouseDown}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* handleExpansion is only visible when `isDragging` is true */}
        <rect
          data-testid="scrubber-component-rect-1"
          x={xPercent}
          className={styles.ScrubberHandleExpansion}
          style={{ transform: `translate(-4.5px)` }}
          width="9"
          height="20"
        />
        <rect
          data-testid="scrubber-component-rect-2"
          x={xPercent}
          className={styles.ScrubberHandle}
          style={{ transform: `translate(-1.5px)` }}
          width="3"
          height="20"
        />
      </g>
      <line
        className={styles.ScrubberLine}
        y2="100%"
        x1={xPercent}
        x2={xPercent}
        data-testid="scrubber-component-line"
      />
    </g>
  );
}
