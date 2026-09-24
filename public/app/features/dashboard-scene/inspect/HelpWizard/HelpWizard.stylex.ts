import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const helpWizardStyles = stylex.create({
  code: {
    flexGrow: 1,
          height: '100%',
          overflow: 'scroll',
  },
  field: {
    width: '100%',
  },
  opts: {
    display: 'flex',
          width: '100%',
          flexGrow: 0,
          alignItems: 'center',
          justifyContent: 'flex-end',
    
          '& button': {
            marginLeft: themeSpacing(1),
          },
  },
});
