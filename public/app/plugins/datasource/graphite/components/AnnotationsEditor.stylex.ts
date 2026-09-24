import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const annotationsEditorStyles = stylex.create({
  heading: {
    fontSize: grafanaTokens.typography_body_fontSize,
        marginBottom: themeSpacing(1),
  },
});
