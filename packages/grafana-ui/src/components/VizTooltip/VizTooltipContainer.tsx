import * as stylex from '@stylexjs/stylex';
import { useState, type HTMLAttributes, useMemo, useRef, useLayoutEffect } from 'react';
import * as React from 'react';
import { useWindowSize } from 'react-use';

import { type Dimensions2D } from '@grafana/data';

import { zIndex } from '../../themes/stylex/constants.stylex';
import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { colors, shadows, shape, spacing } from '../../themes/stylex/tokens.stylex';

import { calculateTooltipPosition } from './utils';

/**
 * @public
 */
export interface VizTooltipContainerProps extends HTMLAttributes<HTMLDivElement> {
  position: { x: number; y: number };
  offset: { x: number; y: number };
  children?: React.ReactNode;
  allowPointerEvents?: boolean;
  /** @internal first-party StyleX overrides (static styles only), applied last */
  xstyle?: stylex.StyleXStyles;
}

/**
 * @public
 */
export const VizTooltipContainer = ({
  position: { x: positionX, y: positionY },
  offset: { x: offsetX, y: offsetY },
  children,
  allowPointerEvents = false,
  className,
  xstyle,
  ...otherProps
}: VizTooltipContainerProps) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipMeasurement, setTooltipMeasurement] = useState<Dimensions2D>({ width: 0, height: 0 });
  const { width, height } = useWindowSize();
  const [placement, setPlacement] = useState({
    x: positionX + offsetX,
    y: positionY + offsetY,
  });

  const resizeObserver = useMemo(
    () =>
      // TS has hard time playing games with @types/resize-observer-browser, hence the ignore
      // @ts-ignore
      new ResizeObserver((entries) => {
        for (let entry of entries) {
          const tW = Math.floor(entry.contentRect.width + 2 * 8); //  adding padding until Safari supports borderBoxSize
          const tH = Math.floor(entry.contentRect.height + 2 * 8);
          if (tooltipMeasurement.width !== tW || tooltipMeasurement.height !== tH) {
            setTooltipMeasurement({
              width: Math.min(tW, width),
              height: Math.min(tH, height),
            });
          }
        }
      }),
    [tooltipMeasurement, width, height]
  );

  useLayoutEffect(() => {
    if (tooltipRef.current) {
      resizeObserver.observe(tooltipRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [resizeObserver]);

  // Make sure tooltip does not overflow window
  useLayoutEffect(() => {
    if (tooltipRef && tooltipRef.current) {
      const { x, y } = calculateTooltipPosition(
        positionX,
        positionY,
        tooltipMeasurement.width,
        tooltipMeasurement.height,
        offsetX,
        offsetY,
        width,
        height
      );

      setPlacement({ x, y });
    }
  }, [width, height, positionX, offsetX, positionY, offsetY, tooltipMeasurement]);

  return (
    <div
      ref={tooltipRef}
      style={{
        position: 'fixed',
        left: 0,
        // disabling pointer-events is to prevent the tooltip from flickering when moving left to right
        // see e.g. https://github.com/grafana/grafana/pull/33609
        pointerEvents: allowPointerEvents ? 'auto' : 'none',
        top: 0,
        transform: `translate(${placement.x}px, ${placement.y}px)`,
        transition: 'transform ease-out 0.1s',
      }}
      aria-live="polite"
      aria-atomic="true"
      {...otherProps}
      className={mergeStylexProps(stylex.props(styles.wrapper, xstyle), { className }).className}
    >
      {children}
    </div>
  );
};

VizTooltipContainer.displayName = 'VizTooltipContainer';

// Same values as getTooltipContainerStyles (compat/emotion/mixins.ts), which plugins still use.
const styles = stylex.create({
  wrapper: {
    overflow: 'hidden',
    backgroundColor: colors['--gf-colors-background-elevated'],
    boxShadow: shadows['--gf-shadows-z2'],
    maxWidth: '800px',
    padding: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
    borderRadius: shape['--gf-shape-radius-default'],
    zIndex: zIndex.tooltip,
  },
});
