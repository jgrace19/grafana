import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const valueMappingsEditorModalStyles = stylex.create({
  tableWrap: {
    minHeight: '40px',
  },
  editTable: {
    width: '100%',
        marginBottom: themeSpacing(2),
    
        'thead th': {
          textAlign: 'center',
        },
    
        'tbody tr:hover': {
          background: grafanaTokens.colors_action_hover,
        },
    
        ' th, td': {
          padding: themeSpacing(1),
        },
  },
});
