import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const addNewSectionStyles = stylex.create({
  section: {
    borderBottom: `1px solid ${grafanaTokens.colors_border_weak}`,
          padding: themeSpacing(2),
  },
  sectionHeader: {
    margin: themeSpacingShorthand(0, 0, 2, 0),
  },
});
