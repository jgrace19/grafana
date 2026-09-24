import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../../../core/stylex/spacing';

export const transformationTypePickerStyles = stylex.create({
  searchWrapper: {
    display: 'flex',
          flexWrap: 'wrap',
          columnGap: themeSpacing(2),
          rowGap: themeSpacing(1),
          width: '100%',
  },
  searchInput: {
    flexGrow: 1,
          width: 'initial',
  },
  switchLabel: {
    fontFamily: grafanaTokens.typography_fontFamilyMonospace,
          fontSize: grafanaTokens.typography_bodySmall_fontSize,
  },
});
