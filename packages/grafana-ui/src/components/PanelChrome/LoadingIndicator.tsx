import * as stylex from '@stylexjs/stylex';

import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';

import { motion } from '../../themes/stylex/constants.stylex';
import { Icon } from '../Icon/Icon';
import { Tooltip } from '../Tooltip/Tooltip';

/**
 * @internal
 */
export type LoadingIndicatorProps = {
  loading: boolean;
  onCancel: () => void;
};

/**
 * @internal
 */
export const LoadingIndicator = ({ onCancel, loading }: LoadingIndicatorProps) => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!loading) {
    return null;
  }

  return (
    <Tooltip content={t('grafana-ui.panel-chrome.tooltip-cancel-loading', 'Cancel query')}>
      <Icon
        xstyle={[styles.spin, !!onCancel && styles.clickable]}
        name={prefersReducedMotion ? 'hourglass' : 'sync'}
        size="sm"
        onClick={onCancel}
        data-testid={selectors.components.LoadingIndicator.icon}
      />
    </Tooltip>
  );
};

const spin = stylex.keyframes({
  '0%': {
    transform: 'rotate(0deg) scaleX(-1)', // scaleX flips the `sync` icon so arrows point the correct way
  },
  '100%': {
    transform: 'rotate(359deg) scaleX(-1)',
  },
});

const styles = stylex.create({
  clickable: {
    cursor: 'pointer',
  },
  spin: {
    animationName: { default: null, [motion.noPreference]: spin },
    animationDuration: { default: null, [motion.noPreference]: '3s' },
    animationTimingFunction: { default: null, [motion.noPreference]: 'linear' },
    animationIterationCount: { default: null, [motion.noPreference]: 'infinite' },
  },
});
