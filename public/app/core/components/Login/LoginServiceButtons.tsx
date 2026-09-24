import { css, cx } from '@emotion/css';
import * as stylex from '@stylexjs/stylex';
import { pickBy } from 'lodash';

import { type GrafanaTheme2, DEFAULT_SAML_NAME } from '@grafana/data';
import { Trans } from '@grafana/i18n';
import { Icon, type IconName, LinkButton, Stack, useStyles2, useTheme2 } from '@grafana/ui';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';
import config from 'app/core/config';

export interface LoginService {
  bgColor: string;
  enabled: boolean;
  name: string;
  hrefName?: string;
  icon: IconName;
}

export interface LoginServices {
  [key: string]: LoginService;
}

const loginServices: () => LoginServices = () => {
  const oauthEnabled = !!config.oauth;

  return {
    saml: {
      bgColor: '#464646',
      enabled: config.samlEnabled,
      name: config.samlName || DEFAULT_SAML_NAME,
      icon: 'key-skeleton-alt',
    },
    google: {
      bgColor: '#e84d3c',
      enabled: oauthEnabled && Boolean(config.oauth.google),
      name: config.oauth?.google?.name || 'Google',
      icon: config.oauth?.google?.icon || ('google' as const),
    },
    azuread: {
      bgColor: '#2f2f2f',
      enabled: oauthEnabled && Boolean(config.oauth.azuread),
      name: config.oauth?.azuread?.name || 'Microsoft',
      icon: config.oauth?.azuread?.icon || ('microsoft' as const),
    },
    github: {
      bgColor: '#464646',
      enabled: oauthEnabled && Boolean(config.oauth.github),
      name: config.oauth?.github?.name || 'GitHub',
      icon: config.oauth?.github?.icon || ('github' as const),
    },
    gitlab: {
      bgColor: '#fc6d26',
      enabled: oauthEnabled && Boolean(config.oauth.gitlab),
      name: config.oauth?.gitlab?.name || 'GitLab',
      icon: config.oauth?.gitlab?.icon || ('gitlab' as const),
    },
    grafanacom: {
      bgColor: '#262628',
      enabled: oauthEnabled && Boolean(config.oauth.grafana_com),
      name: config.oauth?.grafana_com?.name || 'Grafana.com',
      icon: config.oauth?.grafana_com?.icon || ('grafana' as const),
      hrefName: 'grafana_com',
    },
    okta: {
      bgColor: '#2f2f2f',
      enabled: oauthEnabled && Boolean(config.oauth.okta),
      name: config.oauth?.okta?.name || 'Okta',
      icon: config.oauth?.okta?.icon || ('okta' as const),
    },
    oauth: {
      bgColor: '#262628',
      enabled: oauthEnabled && Boolean(config.oauth.generic_oauth),
      name: config.oauth?.generic_oauth?.name || 'OAuth',
      icon: config.oauth?.generic_oauth?.icon || ('signin' as const),
      hrefName: 'generic_oauth',
    },
  };
};

// stylex: pending Button `xstyle`. The per-provider colours override Button's own background and hover
// states, which a StyleX class passed as `className` can't do.
const getServiceStyles = (theme: GrafanaTheme2) => {
  return {
    button: css({
      color: '#d8d9da',
      position: 'relative',
    }),
  };
};

const LoginDivider = () => {
  return (
    <div {...stylex.props(styles.divider)}>
      <div>
        <div {...stylex.props(styles.dividerLine)} />
      </div>
      <div>
        <span>{!config.disableLoginForm && <Trans i18nKey="login.divider.connecting-text">or</Trans>}</span>
      </div>
      <div>
        <div {...stylex.props(styles.dividerLine)} />
      </div>
    </div>
  );
};

function getButtonStyleFor(service: LoginService, styles: ReturnType<typeof getServiceStyles>, theme: GrafanaTheme2) {
  return cx(
    styles.button,
    css({
      backgroundColor: service.bgColor,
      color: theme.colors.getContrastText(service.bgColor),

      ['&:hover']: {
        backgroundColor: theme.colors.emphasize(service.bgColor, 0.15),
        boxShadow: theme.shadows.z1,
      },
    })
  );
}

export const LoginServiceButtons = () => {
  const enabledServices = pickBy(loginServices(), (service) => service.enabled);
  const hasServices = Object.keys(enabledServices).length > 0;
  const theme = useTheme2();
  const serviceStyles = useStyles2(getServiceStyles);

  if (hasServices) {
    return (
      <Stack direction={'column'} width={'100%'}>
        <LoginDivider />
        {Object.entries(enabledServices).map(([key, service]) => {
          const serviceName = service.name;
          return (
            <LinkButton
              key={key}
              className={getButtonStyleFor(service, serviceStyles, theme)}
              href={`login/${service.hrefName ? service.hrefName : key}`}
              target="_self"
              fullWidth
            >
              <Icon xstyle={styles.buttonIcon} name={service.icon} />
              <Trans i18nKey="login.services.sing-in-with-prefix">Sign in with {{ serviceName }}</Trans>
            </LinkButton>
          );
        })}
      </Stack>
    );
  }

  return null;
};

const styles = stylex.create({
  buttonIcon: {
    position: 'absolute',
    left: spacing['--gf-spacing-x1'],
    top: '50%',
    transform: 'translateY(-50%)',
  },
  divider: {
    color: colors['--gf-colors-text-primary'],
    display: 'flex',
    marginBottom: spacing['--gf-spacing-x1'],
    justifyContent: 'space-between',
    textAlign: 'center',
    width: '100%',
  },
  dividerLine: {
    width: 100,
    height: 10,
  },
});
