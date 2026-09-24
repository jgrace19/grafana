import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const userSignupStyles = stylex.create({
  paddingTop: {
    paddingTop: grafanaTokens.spacing_x2,
  },
  signupButton: {
    width: '100%',
    justifyContent: 'center',
  },
});
