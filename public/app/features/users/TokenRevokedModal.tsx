import * as stylex from '@stylexjs/stylex';

import { Trans, t } from '@grafana/i18n';
import { Button, InfoBox, Portal } from '@grafana/ui';
import { modalBackdropStyles, modalContainerStyles } from '@grafana/ui/internal';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';

interface Props {
  maxConcurrentSessions?: number;
}

export const TokenRevokedModal = (props: Props) => {
  const showMaxConcurrentSessions = Boolean(props.maxConcurrentSessions);

  const redirectToLogin = () => {
    window.location.reload();
  };

  return (
    <Portal>
      <div {...stylex.props(modalContainerStyles.modal)}>
        <InfoBox
          title={t(
            'users.token-revoked-modal.title-you-have-been-automatically-signed-out',
            'You have been automatically signed out'
          )}
          severity="warning"
          xstyle={styles.infobox}
        >
          <div {...stylex.props(styles.text)}>
            <p>
              <Trans
                i18nKey="users.token-revoked-modal.auto-revoked"
                values={{ numSessions: showMaxConcurrentSessions ? props.maxConcurrentSessions : '' }}
              >
                Your session token was automatically revoked because you have reached{' '}
                <strong>the maximum number of {'{{numSessions}}'} concurrent sessions</strong> for your account.
              </Trans>
            </p>
            <p>
              <Trans i18nKey="users.token-revoked-modal.resume-message">
                <strong>To resume your session, sign in again.</strong>
                Contact your administrator or visit the license page to review your quota if you are repeatedly signed
                out automatically.
              </Trans>
            </p>
          </div>
          <Button size="md" variant="primary" onClick={redirectToLogin}>
            <Trans i18nKey="users.token-revoked-modal.sign-in">Sign in</Trans>
          </Button>
        </InfoBox>
      </div>
      <div {...stylex.props(modalBackdropStyles.modalBackdrop, styles.backdrop)} />
    </Portal>
  );
};

const styles = stylex.create({
  infobox: {
    marginBottom: 0,
  },
  backdrop: {
    backgroundColor: colors['--gf-colors-background-canvas'],
    opacity: 0.8,
  },
  text: {
    marginTop: spacing['--gf-spacing-x1'],
    marginRight: 0,
    marginBottom: spacing['--gf-spacing-x2'],
    marginLeft: 0,
  },
});
