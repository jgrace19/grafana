import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { progressBarStyles } from './ProgressBar.stylex';
import { useRef, useEffect } from 'react';

import { t } from '@grafana/i18n';

interface ProgressBarProps {
  progress?: number;
  topBottomSpacing?: number;
}
const ProgressBar = ({ progress, topBottomSpacing }: ProgressBarProps) => {
  const styles = (getStyles, topBottomSpacing);
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
      {...stylex.props(progressBarStyles.container)}
      aria-label={t('provisioning.shared.progress-bar.aria-label', 'Progress Bar')}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className={shouldAnimate ? progressBarStyles.fillerAnimated : progressBarStyles.filler} style={{ width: `${progress}%` }} />
    </div>
  );
};


export default ProgressBar;
