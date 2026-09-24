import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const derivedFieldsStyles = stylex.create({
  addButton: {
    marginRight: '10px',
  },
  derivedField: {
    marginBottom: themeSpacing(1),
  },
  container: {
    marginBottom: themeSpacing(4),
  },
  debugSection: {
    marginTop: themeSpacing(4),
  },
});
