import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../../core/stylex/spacing';

export const variableStaticOptionsFormItemsStyles = stylex.create({
  table: {
    'tbody tr': {
          position: 'relative',
        },
    
        'tbody tr:hover': {
          background: grafanaTokens.colors_action_hover,
        },
    
        'th, td': {
          padding: themeSpacing(1),
          width: '49%',
        },
    
        'th:first-child, td:first-child, th:last-child, td:last-child': {
          width: '1%',
        },
  },
  headerIconColumn: {
    width: '1%',
  },
  headerInputColumn: {
    width: '49%',
  },
});
