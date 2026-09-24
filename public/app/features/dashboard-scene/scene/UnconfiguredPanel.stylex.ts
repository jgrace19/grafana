import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';
import emptyPanelSvg from 'img/dashboards/empty-panel.svg';

import { themeSpacing } from '../../../core/stylex/spacing';
import {
  BUTTON_ANIM_DURATION_MS,
  EXIT_DURATION_MS,
  EXIT_EASING,
  TEXT_EXIT_DELAY_MS,
  buttonFrames,
  gearFrames,
  textFrames,
} from '../utils/unconfiguredPanelUtils';

export const unconfiguredPanelStyles = stylex.create({
  root: {
    position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          '::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${emptyPanelSvg})`,
            backgroundSize: '100% auto',
            backgroundPosition: 'bottom',
            backgroundRepeat: 'no-repeat',
            opacity: 0.08,
            pointerEvents: 'none',
          },
  },
  hidden: {
    opacity: 0,
          pointerEvents: 'none',
  },
  quietState: {
    position: 'absolute',
          inset: 0,
          margin: 'auto',
          width: 'fit-content',
          height: 'fit-content',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: themeSpacing(1),
  },
  gearIconWrapper: {
    display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: `1px dashed ${grafanaTokens.colors_text_secondary}`,
          borderRadius: grafanaTokens.shape_radius_circle,
          padding: themeSpacing(1),
          color: grafanaTokens.colors_text_secondary,
  },
  gearEntering: {
    ['@media (prefers-reduced-motion: no-preference), @media (prefers-reduced-motion: reduce)']: {
            animation: `${gearFrames.enter} ${EXIT_DURATION_MS}ms ${EXIT_EASING} both`,
          },
  },
  gearExiting: {
    ['@media (prefers-reduced-motion: no-preference), @media (prefers-reduced-motion: reduce)']: {
            animation: `${gearFrames.exit} ${EXIT_DURATION_MS}ms ${EXIT_EASING} both`,
          },
  },
  textEntering: {
    ['@media (prefers-reduced-motion: no-preference), @media (prefers-reduced-motion: reduce)']: {
            animation: `${textFrames.enter} ${EXIT_DURATION_MS}ms ${EXIT_EASING} both`,
          },
  },
  textExiting: {
    ['@media (prefers-reduced-motion: no-preference), @media (prefers-reduced-motion: reduce)']: {
            animation: `${textFrames.exit} ${EXIT_DURATION_MS}ms ${EXIT_EASING} both`,
            animationDelay: `${TEXT_EXIT_DELAY_MS}ms`,
          },
  },
  buttonList: {
    position: 'absolute',
          inset: 0,
          margin: 'auto',
          width: 'fit-content',
          height: 'fit-content',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          gap: themeSpacing(1),
  },
  buttonListCompact: {
    flexDirection: 'row',
          alignItems: 'center',
  },
  buttonWrapper: {
    display: 'flex',
  },
  buttonEntering: {
    ['@media (prefers-reduced-motion: no-preference), @media (prefers-reduced-motion: reduce)']: {
            animation: `${buttonFrames.enter} ${BUTTON_ANIM_DURATION_MS}ms ease-out both`,
          },
  },
  buttonExiting: {
    ['@media (prefers-reduced-motion: no-preference), @media (prefers-reduced-motion: reduce)']: {
            animation: `${buttonFrames.exit} ${BUTTON_ANIM_DURATION_MS}ms ease-out both`,
          },
  },
  emptyStateWrapper: {
    display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          textAlign: 'center',
  },
  emptyStateIcon: {
    color: grafanaTokens.colors_text_secondary,
          marginBottom: themeSpacing(2),
  },
});
