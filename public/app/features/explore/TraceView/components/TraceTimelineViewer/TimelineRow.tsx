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

type TTimelineRowProps = {
  children: React.ReactNode;
  className?: string;
  /** @internal first-party StyleX overrides */
  xstyle?: stylex.StyleXStyles;
};

interface TimelineRowCellProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  width: number;
  style?: {};
  /** @internal first-party StyleX overrides */
  xstyle?: stylex.StyleXStyles;
}

export default function TimelineRow({ children, className = '', xstyle, ...rest }: TTimelineRowProps) {
  return (
    <div {...mergeStylexProps(stylex.props(styles.row, xstyle), { className })} {...rest}>
      {children}
    </div>
  );
}

export function TimelineRowCell({
  children,
  className = '',
  width,
  style = {},
  xstyle,
  ...rest
}: TimelineRowCellProps) {
  const widthPercent = `${width * 100}%`;
  const mergedStyle = { ...style, flexBasis: widthPercent, maxWidth: widthPercent };
  return (
    <div
      {...mergeStylexProps(stylex.props(styles.rowCell, xstyle), { className, style: mergedStyle })}
      data-testid="TimelineRowCell"
      {...rest}
    >
      {children}
    </div>
  );
}

TimelineRow.Cell = TimelineRowCell;

const styles = stylex.create({
  row: {
    display: 'flex',
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 'auto',
    flexDirection: 'row',
  },
  rowCell: {
    position: 'relative',
  },
});
