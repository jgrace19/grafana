import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const variablesUnknownTableStyles = stylex.create({
  container: {
    marginTop: themeSpacing(4),
        paddingTop: themeSpacing(4),
  },
  infoIcon: {
    marginLeft: themeSpacing(1),
  },
  defaultColumn: {
    width: '1%',
  },
  firstColumn: {
    width: '1%',
        verticalAlign: 'top',
        color: grafanaTokens.colors_text_maxContrast,
  },
  lastColumn: {
    overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        width: '100%',
        textAlign: 'right',
  },
});
