import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { pickBy } from 'lodash';

import { Trans } from '@grafana/i18n';
import { Icon, type IconName, LinkButton, Stack, useTheme2 } from '@grafana/ui';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import config from 'app/core/config';

import { loginServiceButtonsStyles } from './LoginServiceButtons.stylex';

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
      enabled: config.auth.google && oauthEnabled,
      name: 'Google',
      icon: 'google',
    },
    github: {
      bgColor: '#2c2c2c',
      enabled: config.auth.github && oauthEnabled,
      name: 'GitHub',
      icon: 'github',
    },
    gitlab: {
      bgColor: '#fc6d26',
      enabled: config.auth.gitlab && oauthEnabled,
      name: 'GitLab',
      icon: 'gitlab',
    },
    azuread: {
      bgColor: '#1252b3',
      enabled: config.auth.azuread && oauthEnabled,
      name: 'Microsoft',
      icon: 'microsoft',
    },
    okta: {
      bgColor: '#2eb4ff',
      enabled: config.auth.okta && oauthEnabled,
      name: 'Okta',
      icon: 'okta',
    },
    oauth: {
      bgColor: '#262628',
      enabled: config.auth.oauth && oauthEnabled,
      name: config.oauth.name,
      hrefName: 'generic_oauth',
      icon: 'signin',
    },
  };
};

const DEFAULT_SAML_NAME = 'SAML';

const LoginDivider = () => {
  return (
    <div {...stylex.props(loginServiceButtonsStyles.divider)}>
      <div>
        <div {...stylex.props(loginServiceButtonsStyles.dividerLine)} />
      </div>
      <div>
        <span>{!config.disableLoginForm && <Trans i18nKey="login.divider.connecting-text">or</Trans>}</span>
      </div>
      <div>
        <div {...stylex.props(loginServiceButtonsStyles.dividerLine)} />
      </div>
    </div>
  );
};

export const LoginServiceButtons = () => {
  const enabledServices = pickBy(loginServices(), (service) => service.enabled);
  const hasServices = Object.keys(enabledServices).length > 0;
  const theme = useTheme2();

  if (hasServices) {
    return (
      <Stack direction={'column'} width={'100%'}>
        <LoginDivider />
        {Object.entries(enabledServices).map(([key, service]) => {
          const serviceName = service.name;
          return (
            <LinkButton
              key={key}
              {...mergeStylexClassName(stylex.props(loginServiceButtonsStyles.button), undefined)}
              style={{
                backgroundColor: service.bgColor,
                color: theme.colors.getContrastText(service.bgColor),
              }}
              href={`login/${service.hrefName ? service.hrefName : key}`}
              target="_self"
              fullWidth
            >
              <Icon {...stylex.props(loginServiceButtonsStyles.buttonIcon)} name={service.icon} />
              <Trans i18nKey="login.services.sing-in-with-prefix">Sign in with {{ serviceName }}</Trans>
            </LinkButton>
          );
        })}
      </Stack>
    );
  }

  return null;
};
