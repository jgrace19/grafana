import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const imagePreviewStyles = stylex.create({
  previewContainer: {
    position: 'relative',
        width: '100%',
        minHeight: '200px',
        backgroundColor: grafanaTokens.colors_background_secondary,
        borderRadius: grafanaTokens.shape_radius_default,
        overflow: 'hidden',
  },
  loadingBarContainer: {
    position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
  },
  titleContainer: {
    padding: themeSpacing(1),
  },
  image: {
    maxWidth: '100%',
        maxHeight: '100%',
        objectFit: 'contain',
  },
});
