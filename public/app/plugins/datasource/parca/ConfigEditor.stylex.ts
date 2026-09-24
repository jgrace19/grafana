import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../core/stylex/spacing';

export const configEditorStyles = stylex.create({
  container: {
    marginBottom: themeSpacing(2),
        maxWidth: '900px',
  },
});
