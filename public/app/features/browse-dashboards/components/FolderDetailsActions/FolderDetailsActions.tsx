import { skipToken } from '@reduxjs/toolkit/query';
import * as stylex from '@stylexjs/stylex';

import { type OwnerReference as OwnerReferenceType } from '@grafana/api-clients/rtkq/folder/v1beta1';
import { Trans } from '@grafana/i18n';
import { config, reportInteraction } from '@grafana/runtime';
import { LinkButton, Stack, Text } from '@grafana/ui';
import { colors, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';
import { type CombinedFolder, useGetFolderQueryFacade } from 'app/api/clients/folder/v1beta1/hooks';
import { OwnerReference } from 'app/core/components/OwnerReferences/OwnerReference';
import { contextSrv } from 'app/core/services/context_srv';
import { useGetResourceRepositoryView } from 'app/features/provisioning/hooks/useGetResourceRepositoryView';
import { useGetTeamByUidQuery } from 'app/features/teams/hooks';
import { AccessControlAction } from 'app/types/accessControl';

import { getFolderPermissions } from '../../permissions';
import CreateNewButton from '../CreateNewButton';
import { FolderActionsButton } from '../FolderActionsButton';

export const FolderDetailsActions = ({ folderDTO }: { folderDTO?: CombinedFolder }) => {
  // Fetch the root (aka general) folder if we're not in a specific folder
  const { data: rootFolderDTO } = useGetFolderQueryFacade(folderDTO ? undefined : 'general');
  const { isReadOnlyRepo, repoType } = useGetResourceRepositoryView({ folderName: folderDTO?.uid });
  const { canCreateDashboards, canCreateFolders } = getFolderPermissions(folderDTO ?? rootFolderDTO);

  const handleButtonClickToRecentlyDeleted = () => {
    reportInteraction('grafana_browse_dashboards_page_button_to_recently_deleted', {
      origin: window.location.pathname === config.appSubUrl + '/dashboards' ? 'Dashboards' : 'Folder view',
    });
  };

  const canReadTeams = contextSrv.hasPermission(AccessControlAction.ActionTeamsRead);

  return (
    <Stack alignItems="center">
      {canReadTeams && config.featureToggles.teamFolders && folderDTO && 'ownerReferences' in folderDTO && (
        <FolderOwners ownerReferences={folderDTO.ownerReferences} />
      )}
      {config.featureToggles.restoreDashboards && (
        <LinkButton
          variant="secondary"
          href={config.appSubUrl + '/dashboard/recently-deleted'}
          onClick={handleButtonClickToRecentlyDeleted}
        >
          <Trans i18nKey="browse-dashboards.actions.button-to-recently-deleted">Recently deleted</Trans>
        </LinkButton>
      )}
      {folderDTO && <FolderActionsButton folder={folderDTO} repoType={repoType} isReadOnlyRepo={isReadOnlyRepo} />}
      {(canCreateDashboards || canCreateFolders) && (
        <CreateNewButton
          parentFolder={folderDTO}
          canCreateDashboard={canCreateDashboards}
          canCreateFolder={canCreateFolders}
          repoType={repoType}
          isReadOnlyRepo={isReadOnlyRepo}
        />
      )}
    </Stack>
  );
};

const FolderOwners = ({ ownerReferences }: { ownerReferences?: OwnerReferenceType[] }) => {
  const teamOwnerReferences = ownerReferences?.filter((ref) => ref.kind === 'Team');
  const teamUid = teamOwnerReferences?.at(0)?.uid;
  const { data: team, isLoading: isLoadingTeam } = useGetTeamByUidQuery(teamUid ? { name: teamUid } : skipToken);

  if (!teamOwnerReferences || teamOwnerReferences.length === 0 || isLoadingTeam || !team) {
    return null;
  }

  return (
    <div {...stylex.props(styles.folderOwnersContainer)}>
      <Text>
        <Trans i18nKey="browse-dashboards.folder-owners.owned-by">Owned by:</Trans>
      </Text>
      <OwnerReference team={team} />
    </div>
  );
};

const styles = stylex.create({
  folderOwnersContainer: {
    display: 'flex',
    flexDirection: 'row',
    height: spacing['--gf-spacing-x4'],
    lineHeight: spacing['--gf-spacing-x4'],
    paddingTop: 0,
    paddingRight: spacing['--gf-spacing-x2'],
    paddingBottom: 0,
    paddingLeft: spacing['--gf-spacing-x2'],
    gap: spacing['--gf-spacing-x1'],
    borderRadius: shape['--gf-shape-radius-default'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-strong'],
  },
});
