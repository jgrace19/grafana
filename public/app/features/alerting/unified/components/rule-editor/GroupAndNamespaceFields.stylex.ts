import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../stylex/spacing';

export const groupAndNamespaceFieldsStyles = stylex.create({
  flexRow: {
    display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
    
        ' > * + *': {
          marginLeft: themeSpacing(3),
        },
  },
  input: {
    width: '330px !important',
  },
});
