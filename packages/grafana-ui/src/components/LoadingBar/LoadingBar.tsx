import * as stylex from '@stylexjs/stylex';
import { type CSSProperties } from 'react';

import { motion } from '../../themes/stylex/constants.stylex';
import { colors } from '../../themes/stylex/tokens.stylex';

export interface LoadingBarProps {
  width: number;
  delay?: number;
  ariaLabel?: string;
}

const BAR_WIDTH = 28;
const MILLISECONDS_PER_PIXEL = 2.4;
const MIN_DURATION_MS = 500;
const MAX_DURATION_MS = 4000;
const DEFAULT_ANIMATION_DELAY = 300;
const MAX_TRANSLATE_X = (100 / BAR_WIDTH) * 100;

/**
 * The LoadingBar is used as a simple loading slider animation in the top of its container.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/information-loadingbar--docs
 */
export function LoadingBar({ width, delay = DEFAULT_ANIMATION_DELAY, ariaLabel = 'Loading bar' }: LoadingBarProps) {
  const durationMs = Math.min(Math.max(Math.round(width * MILLISECONDS_PER_PIXEL), MIN_DURATION_MS), MAX_DURATION_MS);
  const containerStyles: CSSProperties = {
    overflow: 'hidden',
  };

  return (
    <div style={containerStyles}>
      <div
        aria-label={ariaLabel}
        role="status"
        {...stylex.props(styles.bar, styles.timing(`${delay}ms`, `${durationMs}ms`, `${4 * durationMs}ms`))}
      />
    </div>
  );
}

const slide = stylex.keyframes({
  '0%': {
    transform: 'translateX(-100%)',
  },
  // this gives us a delay between iterations
  '85%, 100%': {
    transform: `translateX(${MAX_TRANSLATE_X}%)`,
  },
});

const styles = stylex.create({
  bar: {
    width: `${BAR_WIDTH}%`,
    height: '1px',
    backgroundImage: `linear-gradient(90deg, transparent 0%, ${colors['--gf-colors-primary-main']} 80.75%, transparent 100%)`,
    transform: 'translateX(-100%)',
    willChange: 'transform',
    animationName: { default: null, [motion.noPreference]: slide, [motion.reduce]: slide },
    animationTimingFunction: { default: null, [motion.noPreference]: 'linear', [motion.reduce]: 'linear' },
    animationIterationCount: { default: null, [motion.noPreference]: 'infinite', [motion.reduce]: 'infinite' },
  },
  // the initial delay keeps the loader hidden when the response is faster than the delay
  timing: (delay: string, duration: string, reducedDuration: string) => ({
    animationDelay: { default: null, [motion.noPreference]: delay, [motion.reduce]: delay },
    animationDuration: { default: null, [motion.noPreference]: duration, [motion.reduce]: reducedDuration },
  }),
});
