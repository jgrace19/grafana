import * as stylex from '@stylexjs/stylex';

import { type IconName } from '@grafana/data';
import { Button } from '@grafana/ui';
import { motion } from '@grafana/ui/stylex/constants.stylex';
import { colors } from '@grafana/ui/stylex/tokens.stylex';

export type ActionButtonProps = {
  onClick: () => void;
  ariaLabel: string;
  label: string;
  icon: IconName;
};

export default function ActionButton(props: ActionButtonProps) {
  const { onClick, ariaLabel, label, icon } = props;

  return (
    <Button
      className={stylex.props(styles.ActionButton).className}
      size="sm"
      variant="secondary"
      fill={'outline'}
      type="button"
      icon={icon}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}

const styles = stylex.create({
  ActionButton: {
    overflow: 'hidden',
    position: 'relative',
    '::after': {
      content: '""',
      backgroundColor: colors['--gf-colors-primary-main'],
      display: 'block',
      position: 'absolute',
      right: 0,
      width: '100%',
      height: '100%',
      opacity: { default: 0, ':active': 0.3 },
      margin: { default: null, ':active': 0 },
      transitionProperty: {
        default: null,
        [motion.noPreference]: 'all',
        ':active': { default: null, [motion.noPreferenceOrReduce]: 'all' },
      },
      transitionDuration: {
        default: null,
        [motion.noPreference]: '0.8s',
        ':active': { default: null, [motion.noPreferenceOrReduce]: '0s' },
      },
    },
  },
});
