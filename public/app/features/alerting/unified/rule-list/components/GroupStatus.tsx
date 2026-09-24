import * as stylex from '@stylexjs/stylex';

import { t } from '@grafana/i18n';
import { Icon, Tooltip } from '@grafana/ui';
import { motion } from '@grafana/ui/stylex/constants.stylex';
import { colors, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';

interface GroupStatusProps {
  status: 'deleting'; // We don't support other statuses yet
}

export function GroupStatus({ status }: GroupStatusProps) {
  return (
    <div {...stylex.props(styles.container)}>
      <div {...stylex.props(styles.loader)} />
      {status === 'deleting' && (
        <Tooltip content={t('alerting.group-status.content-the-group-is-being-deleted', 'The group is being deleted')}>
          <div {...stylex.props(styles.iconWrapper)}>
            <Icon name="trash-alt" size="sm" />
          </div>
        </Tooltip>
      )}
    </div>
  );
}

const rotation = stylex.keyframes({
  '0%': {
    transform: 'rotate(0deg)',
  },
  '100%': {
    transform: 'rotate(360deg)',
  },
});

const styles = stylex.create({
  container: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: spacing['--gf-spacing-x0-5'],
  },

  loader: {
    position: 'absolute',
    inset: `calc(${spacing['--gf-spacing-grid-size']} * -0.5)`,
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: '#FFF',
    borderRadius: shape['--gf-shape-radius-circle'],
    boxSizing: 'border-box',
    animationName: { default: null, [motion.noPreference]: rotation },
    animationIterationCount: { default: null, [motion.noPreference]: 'infinite' },
    animationDuration: { default: null, [motion.noPreference]: '1s' },
    animationTimingFunction: { default: null, [motion.noPreference]: 'linear' },

    '::after': {
      content: '""',
      boxSizing: 'border-box',
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      width: 'calc(100% + 4px)',
      height: 'calc(100% + 4px)',
      borderRadius: shape['--gf-shape-radius-circle'],
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: 'transparent',
      borderBottomColor: colors['--gf-colors-action-selected-border'],
    },
  },

  iconWrapper: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
  },
});
