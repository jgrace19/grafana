import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../../core/stylex/spacing';

export const variableValuesPreviewStyles = stylex.create({
  previewContainer: {
    display: 'flex',
          flexDirection: 'column',
          gap: themeSpacing(1),
          marginTop: themeSpacing(2),
  },
  optionContainer: {
    marginLeft: themeSpacing(0.5),
          marginBottom: themeSpacing(0.5),
  },
  label: {
    whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '50vw',
  },
  table: {
    td: {
            padding: themeSpacingShorthand(0.5, 1),
          },
  },
});
