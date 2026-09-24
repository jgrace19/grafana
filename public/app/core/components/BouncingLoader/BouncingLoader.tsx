import * as stylex from '@stylexjs/stylex';

import { t } from '@grafana/i18n';
import { motion } from '@grafana/ui/stylex/constants.stylex';

import { Branding } from '../Branding/Branding';

export function BouncingLoader() {
  return (
    <div {...stylex.props(styles.container)} aria-live="polite" role="status" aria-label={t('bouncing-loader.label', 'Loading')}>
      <div {...stylex.props(styles.bounce)}>
        <Branding.LoginLogo className={stylex.props(styles.logo).className} />
      </div>
    </div>
  );
}

const fadeIn = stylex.keyframes({
  '0%': {
    opacity: 0,
    animationTimingFunction: 'cubic-bezier(0, 0, 0.5, 1)',
  },
  '100%': {
    opacity: 1,
  },
});

const pulse = stylex.keyframes({
  '0%': {
    opacity: 0,
  },
  '50%': {
    opacity: 1,
  },
  '100%': {
    opacity: 0,
  },
});

const bounce = stylex.keyframes({
  from: {
    transform: 'translateY(0px)',
    animationTimingFunction: 'cubic-bezier(0.3, 0, 0.1, 1)',
  },
  '50%': {
    transform: 'translateY(-50px)',
    animationTimingFunction: 'cubic-bezier(0.9, 0, 0.7, 1)',
  },
  to: {
    transform: 'translateY(0px)',
    animationTimingFunction: 'cubic-bezier(0.3, 0, 0.1, 1)',
  },
});

const squash = stylex.keyframes({
  '0%': {
    transform: 'scaleX(1.3) scaleY(0.8)',
    animationTimingFunction: 'cubic-bezier(0.3, 0, 0.1, 1)',
  },
  '15%': {
    transform: 'scaleX(0.75) scaleY(1.25)',
    animationTimingFunction: 'cubic-bezier(0, 0, 0.7, 0.75)',
  },
  '55%': {
    transform: 'scaleX(1.05) scaleY(0.95)',
    animationTimingFunction: 'cubic-bezier(0.9, 0, 1, 1)',
  },
  '95%': {
    transform: 'scaleX(0.75) scaleY(1.25)',
    animationTimingFunction: 'cubic-bezier(0, 0, 0, 1)',
  },
  '100%': {
    transform: 'scaleX(1.3) scaleY(0.8)',
    animationTimingFunction: 'cubic-bezier(0, 0, 0.7, 1)',
  },
});

const styles = stylex.create({
  container: {
    opacity: 0,
    animationName: { default: null, [motion.noPreference]: fadeIn, [motion.reduce]: pulse },
    animationIterationCount: { default: null, [motion.noPreference]: 1, [motion.reduce]: 'infinite' },
    animationDuration: { default: null, [motion.noPreference]: '0.9s', [motion.reduce]: '4s' },
    animationDelay: { default: null, [motion.noPreference]: '0.5s', [motion.reduce]: '0.5s' },
    animationFillMode: { default: null, [motion.noPreference]: 'forwards' },
  },
  bounce: {
    textAlign: 'center',
    animationName: { default: null, [motion.noPreference]: bounce },
    animationDuration: { default: null, [motion.noPreference]: '0.9s' },
    animationIterationCount: { default: null, [motion.noPreference]: 'infinite' },
  },
  logo: {
    display: 'inline-block',
    animationName: { default: null, [motion.noPreference]: squash },
    animationDuration: { default: null, [motion.noPreference]: '0.9s' },
    animationIterationCount: { default: null, [motion.noPreference]: 'infinite' },
    width: '60px',
    height: '60px',
  },
});
