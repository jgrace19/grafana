import * as stylex from '@stylexjs/stylex';

import { themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const configEditorPackageStyles = stylex.create({
  hrBottomSpace: {
    marginBottom: '56px',
  },
  hrTopSpace: {
    marginTop: '50px',
  },
  advancedSettings: {
    paddingTop: '32px',
  },
  advancedHTTPSettingsMargin: {
    margin: themeSpacingShorthand(3, 0, 1, 0),
  },
});
