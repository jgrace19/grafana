import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../core/stylex/spacing';

export const effectsEditorStyles = stylex.create({
  label: {
    marginBottom: 0
  },
  container: {
    paddingBlock: themeSpacing(0.5)
  },
});
