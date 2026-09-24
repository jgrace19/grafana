import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../../core/stylex/spacing';

export const advancedResourcePickerStyles = stylex.create({
  resourceList: {
    display: 'flex', columnGap: themeSpacing(1), flexWrap: 'wrap', marginBottom: themeSpacing(1)
  },
  resource: {
    flex: '0 0 auto'
  },
  resourceLabel: {
    padding: themeSpacing(1)
  },
  resourceGroupAndName: {
    display: 'flex', columnGap: themeSpacing(0.5)
  },
});
