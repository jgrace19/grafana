import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const annotationQueryEditorStyles = stylex.create({
  container: {
    maxWidth: themeSpacing(60),
          marginBottom: themeSpacing(2),
  },
});
