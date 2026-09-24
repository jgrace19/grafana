import * as stylex from '@stylexjs/stylex';

import { t } from '@grafana/i18n';
import { Icon, Tooltip } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { motion } from '@grafana/ui/stylex/constants.stylex';
import { colors } from '@grafana/ui/stylex/tokens.stylex';

import './ConditionalRenderingOverlay.css';

export const ConditionalRenderingOverlay = () => {
  return (
    <div {...mergeStylexProps(stylex.props(styles.container), { className: 'gf-conditional-rendering-overlay' })}>
      <Tooltip content={t('dashboard.conditional-rendering.overlay.tooltip', 'Element is hidden by show/hide rules.')}>
        <Icon name="eye-slash" xstyle={styles.icon} />
      </Tooltip>
    </div>
  );
};

// The smaller size while the hidden element is hovered lives in ConditionalRenderingOverlay.css: the hover belongs to
// the parent, which is rendered by the layouts.
const styles = stylex.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
    bottom: 0,
    right: 0,
    zIndex: 1,
    transition: { default: null, [motion.noPreferenceOrReduce]: 'all 0.2s ease' },
    '::before': {
      content: '""',
      opacity: 0.6,
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      backgroundColor: colors['--gf-colors-background-canvas'],
      pointerEvents: 'none',
    },
  },
  icon: {
    height: '48px',
    width: '48px',
    maxWidth: '75%',
    maxHeight: '75%',
  },
});
