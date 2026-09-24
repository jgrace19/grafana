import * as stylex from '@stylexjs/stylex';

import { Trans } from '@grafana/i18n';
import { LinkButton, Stack } from '@grafana/ui';
import { getConfig } from 'app/core/config';

export const UserSignup = () => {
  const href = getConfig().verifyEmailEnabled ? `${getConfig().appSubUrl}/verify` : `${getConfig().appSubUrl}/signup`;

  return (
    <Stack direction="column">
      <div {...stylex.props(styles.paddingTop)}>
        <Trans i18nKey="login.signup.new-to-question">New to Grafana?</Trans>
      </div>
      <LinkButton className={stylex.props(styles.button).className} href={href} variant="secondary" fill="outline">
        <Trans i18nKey="login.signup.button-label">Sign up</Trans>
      </LinkButton>
    </Stack>
  );
};

const styles = stylex.create({
  paddingTop: {
    paddingTop: '16px',
  },
  button: {
    width: '100%',
    justifyContent: 'center',
  },
});
