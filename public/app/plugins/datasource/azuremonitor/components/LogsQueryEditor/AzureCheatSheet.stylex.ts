import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../../core/stylex/spacing';

export const azureCheatSheetStyles = stylex.create({
  card: {
    width: '90%',
          display: 'flex',
          flexDirection: 'column',
  },
  rawQuery: {
    backgroundColor: `${grafanaTokens.colors_background_primary}`,
          padding: `${themeSpacing(1)}`,
          marginTop: `${themeSpacing(1)}`,
  },
  spacing: {
    marginBottom: `${themeSpacing(1)}`,
  },
  filterAlignment: {
    display: 'flex',
  },
  categoryDropdown: {
    margin: '0 0 10px 10px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
  },
});
