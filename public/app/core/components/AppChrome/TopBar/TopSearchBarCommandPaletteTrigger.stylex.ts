import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing } from '../../../stylex/spacing';

export const topSearchBarCommandPaletteTriggerStyles = stylex.create({
  inputExtras: {
    width: 'auto',
    minWidth: 140,
    maxWidth: 350,
    flexGrow: 1,
  },
  suffix: {
    display: 'flex',
    gap: themeSpacing(0.5),
  },
  fakeInput: {
    textAlign: 'left',
    paddingLeft: 28,
    color: grafanaTokens.colors_text_disabled,
    ':focus': {
      outline: 'unset',
      boxShadow: 'unset',
    },
  },
});
