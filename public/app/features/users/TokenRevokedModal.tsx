import { css, cx } from '@emotion/css';
import * as stylex from '@stylexjs/stylex';

import { type GrafanaTheme2 } from '@grafana/data';
import { Trans, t } from '@grafana/i18n';
import { Button, InfoBox, Portal, useStyles2, useTheme2 } from '@grafana/ui';
import { getModalStyles } from '@grafana/ui/internal';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

interface Props {
  maxConcurrentSessions?: number;
}

export const TokenRevokedModal = (props: Props) => {
  const pendingStyles = useStyles2(getPendingStyles);
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
          className={pendingStyles.infobox}
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
      <div className={cx(modalStyles.modalBackdrop, pendingStyles.backdrop)} />
    </Portal>
  );
};

// stylex: pending InfoBox and Modal migration
const getPendingStyles = (theme: GrafanaTheme2) => ({
  infobox: css({
    marginBottom: 0,
  }),
  backdrop: css({
    backgroundColor: theme.colors.background.canvas,
    opacity: 0.8,
  }),
});

const styles = stylex.create({
  text: {
    marginTop: spacing['--gf-spacing-x1'],
    marginRight: 0,
    marginBottom: spacing['--gf-spacing-x2'],
    marginLeft: 0,
  },
});
