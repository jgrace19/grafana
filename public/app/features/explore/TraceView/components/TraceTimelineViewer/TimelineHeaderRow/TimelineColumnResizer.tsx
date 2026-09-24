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

import type TNil from '../../types/TNil';
import DraggableManager from '../../utils/DraggableManager/DraggableManager';
import { type DraggableBounds, type DraggingUpdate } from '../../utils/DraggableManager/types';

export type TimelineColumnResizerProps = {
  min: number;
  max: number;
  onChange: (newSize: number) => void;
  position: number;
  columnResizeHandleHeight: number;
};

type TimelineColumnResizerState = {
  dragPosition: number | TNil;
};

export default class TimelineColumnResizer extends React.PureComponent<
  TimelineColumnResizerProps,
  TimelineColumnResizerState
> {
  state: TimelineColumnResizerState;

  _dragManager: DraggableManager;
  _rootElm: Element | TNil;

  constructor(props: TimelineColumnResizerProps) {
    super(props);
    this._dragManager = new DraggableManager({
      getBounds: this._getDraggingBounds,
      onDragEnd: this._handleDragEnd,
      onDragMove: this._handleDragUpdate,
      onDragStart: this._handleDragUpdate,
    });
    this._rootElm = undefined;
    this.state = {
      dragPosition: null,
    };
  }

  componentWillUnmount() {
    this._dragManager.dispose();
  }

  _setRootElm = (elm: Element | TNil) => {
    this._rootElm = elm;
  };

  _getDraggingBounds = (): DraggableBounds => {
    if (!this._rootElm) {
      throw new Error('invalid state');
    }
    const { left: clientXLeft, width } = this._rootElm.getBoundingClientRect();
    const { min, max } = this.props;
    return {
      clientXLeft,
      width,
      maxValue: max,
      minValue: min,
    };
  };

  _handleDragUpdate = ({ value }: DraggingUpdate) => {
    this.setState({ dragPosition: value });
  };

  _handleDragEnd = ({ manager, value }: DraggingUpdate) => {
    manager.resetBounds();
    this.setState({ dragPosition: null });
    this.props.onChange(value);
  };

  render() {
    let left;
    let draggerStyle: React.CSSProperties;
    const { position, columnResizeHandleHeight } = this.props;
    const { dragPosition } = this.state;
    left = `${position * 100}%`;
    const gripStyle = { left };
    let isDraggingLeft = false;
    let isDraggingRight = false;

    if (this._dragManager.isDragging() && this._rootElm && dragPosition != null) {
      isDraggingLeft = dragPosition < position;
      isDraggingRight = dragPosition > position;
      // Draw a highlight from the current dragged position back to the original
      // position, e.g. highlight the change. Draw the highlight via `left` and
      // `right` css styles (simpler than using `width`).
      const draggerLeft = `${Math.min(position, dragPosition) * 100}%`;
      // subtract 1px for draggerRight to deal with the right border being off
      // by 1px when dragging left
      const draggerRight = `calc(${(1 - Math.max(position, dragPosition)) * 100}% - 1px)`;
      draggerStyle = { left: draggerLeft, right: draggerRight };
    } else {
      draggerStyle = gripStyle;
    }
    draggerStyle.height = columnResizeHandleHeight;

    const isDragging = isDraggingLeft || isDraggingRight;
    return (
      <div {...stylex.props(styles.TimelineColumnResizer)} ref={this._setRootElm} data-testid="TimelineColumnResizer">
        <div
          {...mergeStylexProps(stylex.props(styles.gripIcon, isDragging && styles.gripIconDragging), {
            style: gripStyle,
          })}
          data-testid="TimelineColumnResizer--gripIcon"
        />
        <div
          aria-hidden
          {...mergeStylexProps(
            stylex.props(
              styles.dragger,
              isDragging && styles.draggerDragging,
              isDraggingRight && styles.draggerDraggingRight,
              isDraggingLeft && styles.draggerDraggingLeft
            ),
            { style: draggerStyle }
          )}
          onMouseDown={this._dragManager.handleMouseDown}
          data-testid="TimelineColumnResizer--dragger"
        />
      </div>
    );
  }
}

// The dragger's `:hover` border (0,2,0) used to beat the dragging borders (0,1,0), so each dragging variant repeats it.
const hoverBorderColor = 'rgba(0, 0, 0, 0.3)';

const styles = stylex.create({
  TimelineColumnResizer: {
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  dragger: {
    borderLeftWidth: '2px',
    borderLeftStyle: 'solid',
    borderLeftColor: { default: 'transparent', ':hover': hoverBorderColor },
    cursor: 'col-resize',
    height: '5000px',
    marginLeft: '-1px',
    position: 'absolute',
    top: 0,
    width: '1px',
    zIndex: 10,
    '::before': {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: '-8px',
      right: 0,
      content: '" "',
    },
  },
  draggerDragging: {
    backgroundColor: 'rgba(136, 0, 136, 0.05)',
    width: 'unset',
    '::before': {
      left: -2000,
      right: -2000,
    },
  },
  draggerDraggingLeft: {
    borderLeftColor: { default: '#808', ':hover': hoverBorderColor },
    borderRightWidth: '1px',
    borderRightStyle: 'solid',
    borderRightColor: '#999',
  },
  draggerDraggingRight: {
    borderLeftWidth: { default: '1px', ':hover': '2px' },
    borderLeftColor: { default: '#999', ':hover': hoverBorderColor },
    borderRightWidth: '2px',
    borderRightStyle: 'solid',
    borderRightColor: '#808',
  },
  gripIcon: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    '::before': {
      borderRightWidth: '1px',
      borderRightStyle: 'solid',
      borderRightColor: '#ccc',
      content: '" "',
      height: '9px',
      position: 'absolute',
      right: '9px',
      top: '25px',
    },
    '::after': {
      borderRightWidth: '1px',
      borderRightStyle: 'solid',
      borderRightColor: '#ccc',
      content: '" "',
      height: '9px',
      position: 'absolute',
      right: '5px',
      top: '25px',
    },
  },
  gripIconDragging: {
    '::before': {
      borderRightColor: 'rgba(136, 0, 136, 0.5)',
    },
    '::after': {
      borderRightColor: 'rgba(136, 0, 136, 0.5)',
    },
  },
});
