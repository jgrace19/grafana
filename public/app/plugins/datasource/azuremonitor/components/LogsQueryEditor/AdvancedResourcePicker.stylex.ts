import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../../core/stylex/spacing';

export const advancedResourcePickerStyles = stylex.create({
  resourceList: {
    width: '100%', display: 'flex', marginBlock: themeSpacing(1)
  },
});
