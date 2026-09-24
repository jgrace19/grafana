import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const provisionedVariablesSectionStyles = stylex.create({
  nameCell: {
    fontWeight: grafanaTokens.typography_fontWeightMedium,
        width: '20%',
  },
  definitionColumn: {
    width: '70%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        maxWidth: 0,
  },
  sourceCell: {
    width: '1%',
        textAlign: 'center' as const,
  },
});
