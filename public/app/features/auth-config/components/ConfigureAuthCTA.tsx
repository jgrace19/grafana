import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { Trans } from '@grafana/i18n';
import { Icon, Stack, Text, TextLink } from '@grafana/ui';
import { colors, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';

export interface Props {}

const ConfigureAuthCTA: React.FunctionComponent<Props> = () => {
  return (
    <div {...stylex.props(styles.container)}>
      <Stack gap={1} alignItems={'center'}>
        <Icon name={'cog'} />
        <Text>
          <Trans i18nKey="auth-config.configure-auth-cta.configuration-required">Configuration required</Trans>
        </Text>
      </Stack>
      <Text variant={'bodySmall'} color={'secondary'}>
        <Trans i18nKey="auth-config.configure-auth-cta.authentication-configuration-created-moment">
          You have no authentication configuration created at the moment.
        </Trans>
      </Text>
      <TextLink href={'https://grafana.com/docs/grafana/latest/auth/overview/'} external>
        <Trans i18nKey="auth-config.configure-auth-cta.refer-documentation-configure-authentication">
          Refer to the documentation on how to configure authentication
        </Trans>
      </TextLink>
    </div>
  );
};

const styles = stylex.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing['--gf-spacing-x2'],
    backgroundColor: colors['--gf-colors-background-secondary'],
    borderRadius: shape['--gf-shape-radius-default'],
    padding: spacing['--gf-spacing-x3'],
    width: 'max-content',
    marginTop: spacing['--gf-spacing-x3'],
    marginRight: 'auto',
    marginBottom: spacing['--gf-spacing-x3'],
    marginLeft: 'auto',
  },
});

export default ConfigureAuthCTA;
