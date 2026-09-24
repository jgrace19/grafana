import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../stylex/spacing';

export const pageStyles = stylex.create({
  wrapper: {
    label: 'page-wrapper',
          display: 'flex',
          flex: '1 1 0',
          flexDirection: 'column',
          position: 'relative',
          container: 'page / inline-size',
  },
  wrapperPrimary: {
    label: 'page-wrapper-primary',
          background: grafanaTokens.colors_background_primary,
  },
  pageContent: {
    label: 'page-content',
          flexGrow: 1,
  },
  pageInner: {
    label: 'page-inner',
          padding: themeSpacing(2),
          borderBottom: 'none',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          margin: themeSpacingShorthand(0, 0, 0, 0),
    
          [theme.breakpoints.up('md')]: {
            padding: themeSpacing(4),
          },
  },
  canvasContent: {
    label: 'canvas-content',
          display: 'flex',
          flexDirection: 'column',
          padding: themeSpacing(2),
          flexBasis: '100%',
          flexGrow: 1,
  },
});
