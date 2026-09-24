import * as stylex from '@stylexjs/stylex';
import { useRef, useEffect } from 'react';

import { t } from '@grafana/i18n';
import { mergeStylexProps } from '@grafana/ui/internal';
import { motion } from '@grafana/ui/stylex/constants.stylex';
import { colors, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';

interface ProgressBarProps {
  progress?: number;
  topBottomSpacing?: number;
}
const ProgressBar = ({ progress, topBottomSpacing = 2 }: ProgressBarProps) => {
  const previousProgress = useRef(0);
  const shouldAnimate = progress !== undefined && progress > previousProgress.current;

  useEffect(() => {
    if (progress !== undefined) {
      previousProgress.current = progress;
    }
  }, [progress]);

  if (progress === undefined) {
    return null;
  }

  return (
    <div
      {...stylex.props(
        styles.container,
        styles.verticalMargin(`calc(${spacing['--gf-spacing-grid-size']} * ${topBottomSpacing})`)
      )}
      aria-label={t('provisioning.shared.progress-bar.aria-label', 'Progress Bar')}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        {...mergeStylexProps(stylex.props(styles.filler, shouldAnimate && styles.fillerAnimated), {
          style: { width: `${progress}%` },
        })}
      />
    </div>
  );
};

const styles = stylex.create({
  container: {
    height: '10px',
    width: '400px',
    backgroundColor: colors['--gf-colors-background-secondary'],
    borderRadius: shape['--gf-shape-radius-pill'],
    overflow: 'hidden',
    marginRight: 0,
    marginLeft: 0,
  },
  verticalMargin: (margin: string) => ({
    marginTop: margin,
    marginBottom: margin,
  }),
  filler: {
    height: '100%',
    backgroundColor: colors['--gf-colors-success-text'],
  },
  fillerAnimated: {
    transitionProperty: { default: null, [motion.noPreferenceOrReduce]: 'width' },
    transitionDuration: { default: null, [motion.noPreferenceOrReduce]: '0.5s' },
    transitionTimingFunction: { default: null, [motion.noPreferenceOrReduce]: 'ease-in-out' },
  },
});

export default ProgressBar;
