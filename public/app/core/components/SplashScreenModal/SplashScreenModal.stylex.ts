import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../stylex/spacing';

export const splashScreenModalStyles = stylex.create({
  modal: {
    width: '860px',
        maxWidth: '95vw',
        height: '520px',
        maxHeight: '85vh',
        padding: 0,
        overflow: 'hidden',
  },
  container: {
    position: 'relative',
        height: '100%',
  },
  closeButton: {
    position: 'absolute',
        top: themeSpacing(1),
        right: themeSpacing(1),
        zIndex: 1,
        color: grafanaTokens.colors_text_secondary,
  },
});
