import * as stylex from '@stylexjs/stylex';

import { Trans } from '@grafana/i18n';
import { LinkButton, Stack } from '@grafana/ui';

import { getConfig } from 'app/core/config';

import { userSignupStyles } from './UserSignup.stylex';

export const UserSignup = () => {
  const href = getConfig().verifyEmailEnabled ? `${getConfig().appSubUrl}/verify` : `${getConfig().appSubUrl}/signup`;

  return (
    <Stack direction="column">
      <div {...stylex.props(userSignupStyles.paddingTop)}>
        <Trans i18nKey="login.signup.new-to-question">New to Grafana?</Trans>
      </div>
      <LinkButton
        {...stylex.props(userSignupStyles.signupButton)}
        href={href}
        variant="secondary"
        fill="outline"
      >
        <Trans i18nKey="login.signup.button-label">Sign up</Trans>
      </LinkButton>
    </Stack>
  );
};
