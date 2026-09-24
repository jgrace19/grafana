import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const valueMappingsEditorStyles = stylex.create({
  modal: {
    width: '980px',
  },
  compactTable: {
    width: '100%',
        'tbody td': {
          padding: themeSpacing(0.5),
        },
  },
});
