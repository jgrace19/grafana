import * as stylex from '@stylexjs/stylex';
import { useState, useEffect } from 'react';
import * as React from 'react';

import { colors as themeColors, shape } from '@grafana/ui/stylex/tokens.stylex';

type Props = {
  colorPalette: string[];
  min: number;
  max: number;

  // Show a value as string -- when not defined, the raw values will not be shown
  display?: (v: number) => string;
  hoverValue?: number;
  useStopsPercentage?: boolean;
};

type HoverState = {
  isShown: boolean;
  value: number;
};

const GRADIENT_STOPS = 10;

export const ColorScale = ({ colorPalette, min, max, display, hoverValue, useStopsPercentage }: Props) => {
  const [colors, setColors] = useState<string[]>([]);
  const [scaleHover, setScaleHover] = useState<HoverState>({ isShown: false, value: 0 });
  const [percent, setPercent] = useState<number | null>(null); // 0-100 for CSS percentage

  useEffect(() => {
    setColors(getGradientStops({ colorArray: colorPalette, stops: GRADIENT_STOPS, useStopsPercentage }));
  }, [colorPalette, useStopsPercentage]);

  const onScaleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const divOffset = event.nativeEvent.offsetX;
    const offsetWidth = event.currentTarget.offsetWidth;
    const normPercentage = Math.floor((divOffset * 100) / offsetWidth + 1);
    const scaleValue = Math.floor(((max - min) * normPercentage) / 100 + min);

    setScaleHover({ isShown: true, value: scaleValue });
    setPercent(normPercentage);
  };

  const onScaleMouseLeave = () => {
    setScaleHover({ isShown: false, value: 0 });
  };

  useEffect(() => {
    setPercent(hoverValue == null ? null : clampPercent100((hoverValue - min) / (max - min)));
  }, [hoverValue, min, max]);

  return (
    <div {...stylex.props(styles.scaleWrapper)} onMouseMove={onScaleMouseMove} onMouseLeave={onScaleMouseLeave}>
      <div {...stylex.props(styles.scaleGradient, styles.gradient(`linear-gradient(90deg, ${colors.join()})`))}>
        {display && (scaleHover.isShown || hoverValue !== undefined) && (
          <div {...stylex.props(styles.followerContainer)}>
            <div {...stylex.props(styles.follower)} style={{ left: `${percent}%` }} />
          </div>
        )}
      </div>
      {display && (
        <div {...stylex.props(styles.followerContainer)}>
          <div {...stylex.props(styles.legendValues)}>
            <span {...stylex.props(styles.disabled)}>{display(min)}</span>
            <span {...stylex.props(styles.disabled)}>{display(max)}</span>
          </div>
          {percent != null && (scaleHover.isShown || hoverValue !== undefined) && (
            <span {...stylex.props(styles.hoverValue)} style={{ left: `${percent}%` }}>
              {display(hoverValue ?? scaleHover.value)}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

const getGradientStops = ({
  colorArray,
  stops,
  useStopsPercentage = true,
}: {
  colorArray: string[];
  stops: number;
  useStopsPercentage?: boolean;
}): string[] => {
  const colorCount = colorArray.length;
  if (useStopsPercentage && colorCount <= 20) {
    const incr = (1 / colorCount) * 100;
    let per = 0;
    const stops: string[] = [];
    for (const color of colorArray) {
      if (per > 0) {
        stops.push(`${color} ${per}%`);
      } else {
        stops.push(color);
      }
      per += incr;
      stops.push(`${color} ${per}%`);
    }
    return stops;
  }

  const gradientEnd = colorArray[colorCount - 1];
  const skip = Math.ceil(colorCount / stops);
  const gradientStops = new Set<string>();

  for (let i = 0; i < colorCount; i += skip) {
    gradientStops.add(colorArray[i]);
  }

  gradientStops.add(gradientEnd);

  return [...gradientStops];
};

function clampPercent100(v: number) {
  if (v > 1) {
    return 100;
  }
  if (v < 0) {
    return 0;
  }
  return v * 100;
}

const styles = stylex.create({
  scaleWrapper: {
    width: '100%',
    fontSize: '11px',
    opacity: 1,
  },
  scaleGradient: {
    height: '9px',
    pointerEvents: 'none',
    borderRadius: shape['--gf-shape-radius-default'],
  },
  gradient: (backgroundImage: string) => ({ backgroundImage }),
  legendValues: {
    display: 'flex',
    justifyContent: 'space-between',
    pointerEvents: 'none',
  },
  hoverValue: {
    position: 'absolute',
    marginTop: '-14px',
    paddingTop: '3px',
    paddingRight: '15px',
    paddingBottom: '3px',
    paddingLeft: '15px',
    transform: 'translateX(-50%)',
  },
  followerContainer: {
    position: 'relative',
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
  },
  follower: {
    position: 'absolute',
    height: '13px',
    width: '13px',
    borderRadius: shape['--gf-shape-radius-default'],
    transform: 'translateX(-50%) translateY(-50%)',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: themeColors['--gf-colors-text-primary'],
    top: '5px',
  },
  disabled: {
    color: themeColors['--gf-colors-text-disabled'],
  },
});
