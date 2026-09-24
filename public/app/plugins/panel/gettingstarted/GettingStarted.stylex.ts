import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../core/stylex/spacing';

export const gettingStartedStyles = stylex.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundSize: 'cover',
    padding: themeSpacingShorthand(4, 2, 0),
  },
  content: {
    display: 'flex',
    justifyContent: 'center',
    '@media (max-width: 1199.95px)': {
      marginLeft: themeSpacing(3),
      justifyContent: 'flex-start',
    },
  },
  header: {
    marginBottom: themeSpacing(3),
    display: 'flex',
    flexDirection: 'column',
    '@media (max-width: 991.95px)': {
      flexDirection: 'row',
    },
  },
  headerLogo: {
    height: '58px',
    paddingRight: themeSpacing(2),
    display: 'none',
    '@media (min-width: 544px)': {
      display: 'block',
    },
  },
  heading: {
    marginRight: themeSpacing(3),
    marginBottom: themeSpacing(3),
    flexGrow: 1,
    display: 'flex',
    '@media (min-width: 544px)': {
      marginBottom: 0,
    },
  },
  backForwardButtons: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  previous: {
    left: '10px',
    '@media (max-width: 768.95px)': {
      left: 0,
    },
  },
  forward: {
    right: '10px',
    '@media (max-width: 768.95px)': {
      right: 0,
    },
  },
  dismiss: {
    alignSelf: 'flex-end',
    marginBottom: themeSpacing(1),
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  loadingText: {
    marginRight: themeSpacing(1),
  },
});
