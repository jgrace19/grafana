import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const variableEditorListRowStyles = stylex.create({
  dragHandle: {
    cursor: 'grab',
          marginLeft: themeSpacing(1),
  },
  column: {
    width: '1%',
  },
  nameLink: {
    cursor: 'pointer',
          color: grafanaTokens.colors_primary_text,
  },
  definitionColumn: {
    width: '100%',
          maxWidth: '200px',
          cursor: 'pointer',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
  },
  iconPassed: {
    color: grafanaTokens.colors_text_primary,
          marginRight: themeSpacing(2),
  },
  iconFailed: {
    color: grafanaTokens.colors_text_primary,
          marginRight: themeSpacing(2),
  },
  icons: {
    display: 'flex',
          gap: themeSpacing(2),
          alignItems: 'center',
  },
});
