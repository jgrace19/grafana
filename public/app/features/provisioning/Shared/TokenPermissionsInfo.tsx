
import { t, Trans } from '@grafana/i18n';
import { Stack, TextLink, } from '@grafana/ui';

import { type InstructionAvailability } from '../Wizard/types';

export function TokenPermissionsInfo({ type }: { type: InstructionAvailability }) {
  const styles = (getStyles);
  const { tokenText, createTokenLink, createTokenButtonText } = connectStepInstruction()[type];

  return (
    <div {...stylex.props(tokenPermissionsInfoStyles.container)}>
      <Stack gap={0.5} wrap={'wrap'}>
        <Trans i18nKey="provisioning.token-permissions-info.go-to">Go to</Trans>
        <TextLink external href={createTokenLink}>
          {tokenText}
        </TextLink>
        <Trans i18nKey="provisioning.token-permissions-info.and-click">and click</Trans>
        <strong>"{createTokenButtonText}".</strong>
        <Trans i18nKey="provisioning.token-permissions-info.make-sure">Create a token with these permissions</Trans>:
      </Stack>

      <ul {...stylex.props(tokenPermissionsInfoStyles.permissionsList)}>
        {getPermissionsForProvider(type).map((permission) => (
          <AccessLevelField key={permission.name} label={permission.name} access={permission.access} />
        ))}
      </ul>
    </div>
  );
}


type Permission = {
  name: string;
  access: string;
};

function getPermissionsForProvider(type: InstructionAvailability): Permission[] {
  switch (type) {
    case 'github':
      // GitHub UI is English only, so these strings are not translated
      return [
        { name: 'Contents', access: 'Read and write' },
        { name: 'Metadata', access: 'Read only' },
        { name: 'Pull requests', access: 'Read and write' },
        { name: 'Webhooks', access: 'Read and write' },
      ];
    case 'gitlab':
      return [
        {
          name: t('provisioning.gitlab.permissions.repository-label', 'Repository'),
          access: t('provisioning.gitlab.permissions.repository-read-write', 'Read and write'),
        },
        {
          name: t('provisioning.gitlab.permissions.user-label', 'User'),
          access: t('provisioning.gitlab.permissions.user-read', 'Read only'),
        },
        {
          name: t('provisioning.gitlab.permissions.api', 'API'),
          access: t('provisioning.gitlab.permissions.api-read-write', 'Read and write'),
        },
      ];
    case 'bitbucket':
      return [
        {
          name: t('provisioning.bitbucket.permissions.repository-label', 'Repositories'),
          access: t('provisioning.bitbucket.permissions.repository-read-write-admin', 'Read, and write'),
        },
        {
          name: t('provisioning.bitbucket.permissions.pull-requests-label', 'Pull requests'),
          access: t('provisioning.bitbucket.permissions.pull-requests-read-write', 'Read and write'),
        },
        {
          name: t('provisioning.bitbucket.permissions.webhooks-label', 'Webhooks'),
          access: t('provisioning.bitbucket.permissions.webhooks-read-write', 'Read and write'),
        },
      ];
    default:
      return [];
  }
}

function AccessLevelField({ label, access }: { label: string; access: string }) {
  const styles = (getStyles);
  return (
    <li>
      {label}: <span {...stylex.props(tokenPermissionsInfoStyles.accessLevel)}>{access}</span>
    </li>
  );
}

function connectStepInstruction() {
  return {
    bitbucket: {
      createTokenLink: 'https://id.atlassian.com/manage-profile/security/api-tokens',
      tokenText: t('provisioning.token-permissions-info.bitbucket.token-text', 'Bitbucket API tokens'),
      createTokenButtonText: t(
        'provisioning.token-permissions-info.bitbucket.create-token-button',
        'Create API Token with scopes'
      ),
    },
    gitlab: {
      createTokenLink: 'https://gitlab.com/-/user_settings/personal_access_tokens',
      tokenText: t('provisioning.token-permissions-info.gitlab.token-text', 'GitLab Personal Access Token'),
      createTokenButtonText: t('provisioning.token-permissions-info.gitlab.create-token-button', 'Add new token'),
    },
    // GitHub UI is English only, so these strings are not translated
    github: {
      createTokenLink: 'https://github.com/settings/personal-access-tokens/new',
      tokenText: 'GitHub Personal Access Token',
      createTokenButtonText: 'Fine-grained token',
    },
  };
}
