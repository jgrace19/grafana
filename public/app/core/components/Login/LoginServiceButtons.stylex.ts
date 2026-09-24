import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing } from '../../stylex/spacing';

export const loginServiceButtonsStyles = stylex.create({
  button: {
    color: '#d8d9da',
    position: 'relative',
  },
  buttonIcon: {
    position: 'absolute',
    left: themeSpacing(1),
    top: '50%',
    transform: 'translateY(-50%)',
  },
  divider: {
    color: grafanaTokens.colors_text_primary,
    display: 'flex',
    marginBottom: themeSpacing(1),
    justifyContent: 'space-between',
    textAlign: 'center',
    width: '100%',
  },
  dividerLine: {
    width: 100,
    height: 10,
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: grafanaTokens.colors_text_primary,
  },
});
