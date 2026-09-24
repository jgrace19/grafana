import clsx from 'clsx';

import { Trans, t } from '@grafana/i18n';
import { Button, InfoBox, Portal, useTheme2 } from '@grafana/ui';
import { getModalStyles } from '@grafana/ui/internal';

interface Props {
  maxConcurrentSessions?: number;
}

export const TokenRevokedModal = (props: Props) => {
  const styles = (getStyles);
  const theme = useTheme2();

  const modalStyles = getModalStyles(theme);

  const showMaxConcurrentSessions = Boolean(props.maxConcurrentSessions);

  const redirectToLogin = () => {
    window.location.reload();
  };

  return (
    <Portal>
      <div className={modalStyles.modal}>
        <InfoBox
          title={t(
            'users.token-revoked-modal.title-you-have-been-automatically-signed-out',
            'You have been automatically signed out'
          )}
          severity="warning"
          {...stylex.props(tokenRevokedModalStyles.infobox)}
        >
          <div {...stylex.props(tokenRevokedModalStyles.text)}>
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
      <div {...mergeStylexClassName(stylex.props(tokenRevokedModalStyles.backdrop, modalStyles.modalBackdrop, ), undefined)} />
    </Portal>
  );
};

