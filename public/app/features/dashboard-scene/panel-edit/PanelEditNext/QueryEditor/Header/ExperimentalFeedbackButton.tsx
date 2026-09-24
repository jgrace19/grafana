import * as stylex from '@stylexjs/stylex';
import { useRef } from 'react';

import { t } from '@grafana/i18n';
import { Button, Dropdown, Menu } from '@grafana/ui';
import { easings, motion } from '@grafana/ui/stylex/constants.stylex';
import { colors } from '@grafana/ui/stylex/tokens.stylex';

import { startIntercomSurvey } from '../../tracking';
import { useActionsContext, useQueryEditorUIContext } from '../QueryEditorContext';

export function ExperimentalFeedbackButton() {
  const { showVersionBanner } = useQueryEditorUIContext();
  const { onSwitchToClassic } = useActionsContext();

  // Track whether the banner was visible when this component first mounted.
  // If it was, the user dismissed it - animate the button in.
  // If it wasn't (already dismissed on load), skip the animation.
  const bannerWasInitiallyVisible = useRef(showVersionBanner);
  const shouldAnimate = bannerWasInitiallyVisible.current && !showVersionBanner;

  if (showVersionBanner || !onSwitchToClassic) {
    return null;
  }

  const menu = (
    <Menu>
      <Menu.Item
        label={t('query-editor-next.experimental-button.give-feedback', 'Give feedback')}
        icon="comment-alt-message"
        onClick={() => startIntercomSurvey()}
      />
      <Menu.Item
        label={t('query-editor-next.experimental-button.back-to-classic', 'Go back to classic editor')}
        icon="arrow-left"
        onClick={() => {
          startIntercomSurvey();
          onSwitchToClassic?.();
        }}
      />
    </Menu>
  );

  return (
    <div {...stylex.props(styles.wrapper, shouldAnimate && styles.animated)}>
      <Dropdown overlay={menu} placement="bottom-end">
        <Button
          size="sm"
          fill="text"
          icon="flask"
          variant="secondary"
          xstyle={styles.button}
          tooltip={t('query-editor-next.experimental-button.tooltip', 'Experimental feature options')}
          aria-label={t('query-editor-next.experimental-button.aria-label', 'Experimental feature options')}
        />
      </Dropdown>
    </div>
  );
}

const slideInAndPulse = stylex.keyframes({
  '0%': {
    opacity: 0,
    transform: 'translateX(24px) scale(0.6)',
  },
  '60%': {
    opacity: 1,
    transform: 'translateX(0) scale(1.2)',
  },
  '80%': {
    transform: 'translateX(0) scale(0.9)',
  },
  '100%': {
    opacity: 1,
    transform: 'translateX(0) scale(1)',
  },
});

const styles = stylex.create({
  button: {
    color: { default: colors['--gf-colors-warning-main'], ':hover': colors['--gf-colors-warning-text'] },
  },
  wrapper: {
    display: 'flex',
  },
  animated: {
    animationName: { default: null, [motion.noPreference]: slideInAndPulse },
    animationDuration: { default: null, [motion.noPreference]: '0.6s' },
    animationTimingFunction: { default: null, [motion.noPreference]: easings.easeOut },
    animationDelay: { default: null, [motion.noPreference]: '100ms' },
    animationFillMode: { default: null, [motion.noPreference]: 'both' },
  },
});
