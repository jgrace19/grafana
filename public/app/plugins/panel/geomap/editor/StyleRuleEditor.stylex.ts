import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const styleRuleEditorStyles = stylex.create({
  rule: {
    marginBottom: themeSpacing(1),
  },
  row: {
    display: 'flex',
        marginBottom: '4px',
  },
  inline: {
    marginBottom: 0,
        marginLeft: '4px',
  },
  button: {
    marginLeft: '4px',
  },
  flexRow: {
    display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
  },
});
