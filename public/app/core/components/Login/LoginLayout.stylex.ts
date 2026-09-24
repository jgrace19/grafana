import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../stylex/spacing';

const flyInAnimation = stylex.keyframes({
  from: {
    opacity: 0,
    transform: 'translate(-60px, 0px)',
  },
  to: {
    opacity: 1,
    transform: 'translate(0px, 0px)',
  },
});

const motionNoPreference = '@media (prefers-reduced-motion: no-preference)';
const motionReduce = '@media (prefers-reduced-motion: reduce)';
const upSm = '@media (min-width: 544px)';

export const loginLayoutStyles = stylex.create({
  loginMain: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '100%',
  },
  container: {
    minHeight: '100%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    flex: 1,
    minWidth: '100%',
    marginLeft: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginAnim: {
    '::before': {
      opacity: 1,
    },
  },
  loginAnimContent: {
    opacity: 1,
  },
  loginLogo: {
    width: '100%',
    maxWidth: 60,
    marginBottom: themeSpacing(2),
    [upSm]: {
      maxWidth: 100,
    },
  },
  loginLogoWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: themeSpacing(3),
  },
  titleWrapper: {
    textAlign: 'center',
  },
  mainTitle: {
    fontSize: 22,
    [upSm]: {
      fontSize: 32,
    },
  },
  subTitle: {
    fontSize: grafanaTokens.typography_size_md,
    color: grafanaTokens.colors_text_secondary,
  },
  loginContent: {
    maxWidth: 478,
    width: 'calc(100% - 2rem)',
    display: 'flex',
    alignItems: 'stretch',
    flexDirection: 'column',
    position: 'relative',
    justifyContent: 'flex-start',
    zIndex: 1,
    minHeight: 320,
    borderRadius: grafanaTokens.shape_radius_lg,
    padding: themeSpacingShorthand(2, 0),
    opacity: 0,
    [motionNoPreference]: {
      transitionProperty: 'opacity',
      transitionDuration: '0.5s',
      transitionTimingFunction: 'ease-in-out',
    },
    [motionReduce]: {
      opacity: 1,
    },
    [upSm]: {
      minHeight: themeSpacing(40),
      justifyContent: 'center',
    },
  },
  loginOuterBox: {
    display: 'flex',
    overflowY: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginInnerBox: {
    padding: themeSpacingShorthand(0, 2, 2, 2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
    maxWidth: 415,
    width: '100%',
    transform: 'translate(0px, 0px)',
    [motionNoPreference]: {
      transitionProperty: 'all',
      transitionDuration: '0.25s',
      transitionTimingFunction: 'ease',
    },
  },
  enterAnimation: {
    [motionNoPreference]: {
      animationName: flyInAnimation,
      animationTimingFunction: 'ease-out',
      animationDuration: '0.2s',
    },
  },
});
