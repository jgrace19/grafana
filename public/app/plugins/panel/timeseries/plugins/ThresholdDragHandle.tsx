import * as stylex from '@stylexjs/stylex';
import { noop } from 'lodash';
import { useMemo, useState } from 'react';
import Draggable, { type DraggableBounds } from 'react-draggable';

import { type Threshold } from '@grafana/data';
import { useTheme2 } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { shape, typography } from '@grafana/ui/stylex/tokens.stylex';

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
  const mainColor = theme.visualization.getColorByName(step.color);
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
      <div
        {...mergeStylexProps(
          stylex.props(
            styles.handle,
            styles.color(mainColor),
            !disabled && styles.draggable,
            arrowStyles[outOfBounds],
            outOfBounds !== 'none' && styles.outOfBounds
          ),
          { style: { color: textColor } }
        )}
      >
        <span {...stylex.props(styles.handleText)}>{formatValue(currentValue)}</span>
      </div>
    </Draggable>
  );
};

ThresholdDragHandle.displayName = 'ThresholdDragHandle';

const styles = stylex.create({
  handle: {
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    width: 'calc(100% - 9px)',
    height: '18px',
    marginTop: '-9px',
    cursor: 'initial',
    borderTopRightRadius: shape['--gf-shape-radius-default'],
    borderBottomRightRadius: shape['--gf-shape-radius-default'],
    fontSize: typography['--gf-typography-body-small-font-size'],
  },
  color: (mainColor: string) => ({
    borderColor: mainColor,
    backgroundColor: mainColor,
  }),
  draggable: {
    cursor: 'grab',
  },
  outOfBounds: {
    marginTop: 0,
    borderTopLeftRadius: shape['--gf-shape-radius-default'],
    borderTopRightRadius: shape['--gf-shape-radius-default'],
    borderBottomRightRadius: shape['--gf-shape-radius-default'],
    borderBottomLeftRadius: shape['--gf-shape-radius-default'],
  },
  handleText: {
    textAlign: 'center',
    width: '100%',
    display: 'block',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
});

// The handle's arrow: a CSS triangle, pointing left when in bounds and up or down when the threshold is off-chart.
const arrowStyles = stylex.create({
  none: {
    '::before': {
      content: "''",
      position: 'absolute',
      bottom: 0,
      top: 0,
      width: 0,
      height: 0,
      left: '-9px',
      borderRightStyle: 'solid',
      borderRightWidth: '9px',
      borderRightColor: 'inherit',
      borderTopWidth: '9px',
      borderTopStyle: 'solid',
      borderTopColor: 'transparent',
      borderBottomWidth: '9px',
      borderBottomStyle: 'solid',
      borderBottomColor: 'transparent',
    },
  },
  top: {
    '::before': {
      content: "''",
      position: 'absolute',
      bottom: 0,
      top: '-7px',
      width: 0,
      height: 0,
      left: 'calc(50% - 2.5px)',
      borderRightStyle: 'solid',
      borderRightWidth: '5px',
      borderRightColor: 'inherit',
      borderTopWidth: '5px',
      borderTopStyle: 'solid',
      borderTopColor: 'transparent',
      borderBottomWidth: '5px',
      borderBottomStyle: 'solid',
      borderBottomColor: 'transparent',
      transform: 'rotate(90deg)',
    },
  },
  bottom: {
    '::before': {
      content: "''",
      position: 'absolute',
      bottom: 0,
      top: 'calc(100% - 2.5px)',
      width: 0,
      height: 0,
      left: 'calc(50% - 2.5px)',
      borderRightStyle: 'solid',
      borderRightWidth: '5px',
      borderRightColor: 'inherit',
      borderTopWidth: '5px',
      borderTopStyle: 'solid',
      borderTopColor: 'transparent',
      borderBottomWidth: '5px',
      borderBottomStyle: 'solid',
      borderBottomColor: 'transparent',
      transform: 'rotate(-90deg)',
    },
  },
});
