import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const derivedFieldStyles = stylex.create({
  row: {
    display: 'flex',
        alignItems: 'baseline',
  },
  nameField: {
    flex: 2,
        marginRight: themeSpacing(0.5),
  },
  regexField: {
    flex: 3,
        marginRight: themeSpacing(0.5),
  },
  urlField: {
    flex: 1,
        marginRight: themeSpacing(0.5),
  },
  urlDisplayLabelField: {
    flex: 1,
  },
  internalLink: {
    marginRight: themeSpacing(1),
  },
  openNewTab: {
    marginRight: themeSpacing(1),
  },
  dataSource: {

  },
  nameMatcherField: {
    width: themeSpacing(20),
        marginRight: themeSpacing(0.5),
  },
});
