import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { enterpriseAuthFeaturesCardStyles } from './EnterpriseAuthFeaturesCard.stylex';
import { useState } from 'react';

import { GrafanaEdition } from '@grafana/data/internal';
import { t, Trans } from '@grafana/i18n';
import { config } from '@grafana/runtime';
import { Text, Stack, Button, LinkButton } from '@grafana/ui';
import { CloudEnterpriseBadge } from 'app/core/components/Branding/CloudEnterpriseBadge';
import { backendSrv } from 'app/core/services/backend_srv';
import { contextSrv } from 'app/core/services/context_srv';

export interface Props {
  page?: 'teams' | 'users';
}

export function EnterpriseAuthFeaturesCard({ page }: Props) {
  const helpFlags = contextSrv.user.helpFlags1;
  const HELP_FLAG_ENTERPRISE_AUTH = 0x0004;
  const [isDismissed, setDismissed] = useState<boolean>(Boolean(helpFlags & HELP_FLAG_ENTERPRISE_AUTH));

  const onDismiss = () => {
    backendSrv
      .put(`/api/user/helpflags/${HELP_FLAG_ENTERPRISE_AUTH}`, undefined, { showSuccessAlert: false })
      .then((res) => {
        contextSrv.user.helpFlags1 = res.helpFlags1;
        setDismissed(true);
      });
  };

  // This card is only visible in oss
  if (isDismissed || !isOpenSourceBuildOrUnlicenced()) {
    return null;
  }

  return (
    <div {...stylex.props(enterpriseAuthFeaturesCardStyles.box)}>
      <Stack direction="row" alignItems="center" justifyContent={'space-between'}>
        <CloudEnterpriseBadge />
        <Button
          variant="secondary"
          fill="text"
          icon="times"
          onClick={onDismiss}
          aria-label={t('admin.enterprise-auth-features-card.dismiss', 'Dismiss')}
        />
      </Stack>
      <Stack direction="column" gap={0.5}>
        <Text variant="h4">
          <Trans i18nKey="admin.enterprise-auth-features-card.heading">Enterprise authentication</Trans>
        </Text>
        <Text variant="body" color="secondary">
          <Trans i18nKey="admin.enterprise-auth-features-card.text">
            Manage users, teams, and permissions automatically with <strong>SAML</strong>, <strong>SCIM</strong>,{' '}
            <strong>LDAP</strong>, and <strong>RBAC</strong> — available in Grafana Cloud and Enterprise.
          </Trans>
        </Text>
      </Stack>
      <div>
        <LinkButton
          href={`https://grafana.com/auth/sign-up/create-user?cloud-auth=&redirectPath=cloud-auth&utm_source=oss-grafana&cnt-admin-${page}`}
          icon="external-link-alt"
          variant="secondary"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Trans i18nKey="admin.enterprise-auth-features-card.learn-more-link">Learn more</Trans>
        </LinkButton>
      </div>
    </div>
  );
}


export function isOpenSourceBuildOrUnlicenced() {
  if (config.buildInfo.edition === GrafanaEdition.OpenSource) {
    return true;
  }

  if (config.licenseInfo.stateInfo !== 'Licensed') {
    return true;
  }

  return false;
}
