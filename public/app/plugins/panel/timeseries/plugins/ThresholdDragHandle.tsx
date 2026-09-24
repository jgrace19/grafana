import * as stylex from '@stylexjs/stylex';
import { thresholdDragHandleStyles } from './ThresholdDragHandle.stylex';

import { noop } from 'lodash';
import { useMemo, useState } from 'react';
import Draggable, { type DraggableBounds } from 'react-draggable';

import { type Threshold, type GrafanaTheme2 } from '@grafana/data';
import { useTheme2 } from '@grafana/ui';

type OutOfBounds = 'top' | 'bottom' | 'none';

interface ThresholdDragHandleProps {
  step: Threshold;
  y: number;
  dragBounds: DraggableBounds;
  mapPositionToValue: (y: number) => number;
  onChange?: (value: number) => void;
  formatValue: (value: number) => string;
}

export const ThresholdDragHandle = ({
  step,
  y,
  dragBounds,
  mapPositionToValue,
  formatValue,
  onChange,
}: ThresholdDragHandleProps) => {
  const theme = useTheme2();
  let yPos = y;
  let outOfBounds: OutOfBounds = 'none';

  if (y < (dragBounds.top ?? 0)) {
    outOfBounds = 'top';
  }

  // there seems to be a 22px offset at the bottom where the threshold line is still drawn
  // this is probably offset by the size of the x-axis component
  if (y > (dragBounds.bottom ?? 0) + 22) {
    outOfBounds = 'bottom';
  }

  if (outOfBounds === 'bottom') {
    yPos = dragBounds.bottom ?? y;
  }

  if (outOfBounds === 'top') {
    yPos = dragBounds.top ?? y;
  }

  const disabled = typeof onChange !== 'function';
  const [currentValue, setCurrentValue] = useState(step.value);

  const textColor = useMemo(() => {
    return theme.colors.getContrastText(theme.visualization.getColorByName(step.color));
  }, [step.color, theme]);

  return (
    <Draggable
      axis="y"
      grid={[1, 1]}
      disabled={disabled}
      onStop={
        disabled
          ? noop
          : (_e, d) => {
              onChange(mapPositionToValue(d.lastY));
              // as of https://github.com/react-grid-layout/react-draggable/issues/390#issuecomment-623237835
              return false;
            }
      }
      onDrag={(_e, d) => setCurrentValue(mapPositionToValue(d.lastY))}
      position={{ x: 0, y: yPos }}
      bounds={dragBounds}
    >
      <div className={styles.handle} style={{ color: textColor }}>
        <span {...stylex.props(thresholdDragHandleStyles.handleText)}>{formatValue(currentValue)}</span>
      </div>
    </Draggable>
  );
};

ThresholdDragHandle.displayName = 'ThresholdDragHandle';


function getArrowStyles(outOfBounds: OutOfBounds) {
  const inBounds = outOfBounds === 'none';

  const triangle = (size: number) =>
    ({
      content: "''",
      position: 'absolute',

      bottom: 0,
      top: 0,
      width: 0,
      height: 0,
      left: 0,

      borderRightStyle: 'solid',
      borderRightWidth: `${size}px`,
      borderRightColor: 'inherit',
      borderTop: `${size}px solid transparent`,
      borderBottom: `${size}px solid transparent`,
    }) as const;

  if (inBounds) {
    return css({
      ...triangle(9),
      left: '-9px',
    });
  }

  if (outOfBounds === 'top') {
    return css({
      ...triangle(5),
      left: 'calc(50% - 2.5px)',
      top: '-7px',
      transform: 'rotate(90deg)',
    });
  }

  if (outOfBounds === 'bottom') {
    return css({
      ...triangle(5),
      left: 'calc(50% - 2.5px)',
      top: 'calc(100% - 2.5px)',
      transform: 'rotate(-90deg)',
    });
  }

  return '';
}
