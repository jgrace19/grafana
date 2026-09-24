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

import { fireEvent, render, screen } from '@testing-library/react';

import TimelineColumnResizer, { type TimelineColumnResizerProps } from './TimelineColumnResizer';

const mockOnChange = jest.fn();

describe('<TimelineColumnResizer>', () => {
  const props: TimelineColumnResizerProps = {
    min: 0.1,
    max: 0.9,
    onChange: mockOnChange,
    position: 0.5,
    columnResizeHandleHeight: 10,
  };

  beforeEach(() => {
    mockOnChange.mockReset();
    render(<TimelineColumnResizer {...props} />);
  });

  it('renders without exploding', () => {
    expect(screen.getByTestId('TimelineColumnResizer')).toBeTruthy();
    expect(screen.getByTestId('TimelineColumnResizer--gripIcon')).toBeTruthy();
    expect(screen.getByTestId('TimelineColumnResizer--dragger')).toBeTruthy();
  });

  it('does not render a dragging indicator when not dragging', () => {
    const dragger = screen.getByTestId('TimelineColumnResizer--dragger');
    expect(dragger.style.left).toBe('50%');
    expect(dragger.style.right).toBe('');
  });

  it('renders a dragging indicator when dragging', () => {
    fireEvent.mouseDown(screen.getByTestId('TimelineColumnResizer--dragger'), { clientX: 0 });
    fireEvent.mouseMove(screen.getByTestId('TimelineColumnResizer--dragger'), { clientX: -5 });
    // Dragging left highlights from the dragged position (clamped to min) back to the original position.
    const dragger = screen.getByTestId('TimelineColumnResizer--dragger');
    expect(dragger.style.left).toBe('10%');
    expect(dragger.style.right).toBe('calc(50% - 1px)');
  });
});
