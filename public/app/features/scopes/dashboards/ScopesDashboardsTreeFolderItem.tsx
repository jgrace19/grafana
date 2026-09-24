
import { t } from '@grafana/i18n';
import { Icon, IconButton, Spinner, } from '@grafana/ui';

import { useScopesServices } from '../ScopesContextProvider';

import { ScopesDashboardsTree } from './ScopesDashboardsTree';
import { type OnFolderUpdate, type SuggestedNavigationsFolder, type SuggestedNavigationsFoldersMap } from './types';

export interface ScopesDashboardsTreeFolderItemProps {
  folder: SuggestedNavigationsFolder;
  folderPath: string[];
  folders: SuggestedNavigationsFoldersMap;
  onFolderUpdate: OnFolderUpdate;
  subScopePath?: string[];
}

export function ScopesDashboardsTreeFolderItem({
  subScopePath,
  folder,
  folderPath,
  folders,
  onFolderUpdate,
}: ScopesDashboardsTreeFolderItemProps) {
  const styles = (getStyles);

  // get scopesselector service
  const scopesSelectorService = useScopesServices()?.scopesSelectorService ?? undefined;
  const scopesDashboardsService = useScopesServices()?.scopesDashboardsService ?? undefined;
  return (
    <div {...stylex.props(scopesDashboardsTreeFolderItemStyles.container)} role="treeitem" aria-selected={folder.expanded}>
      <div {...stylex.props(scopesDashboardsTreeFolderItemStyles.row)}>
        <button
          {...stylex.props(scopesDashboardsTreeFolderItemStyles.expand)}
          data-testid={`scopes-dashboards-${folder.title}-expand`}
          aria-label={
            folder.expanded ? t('scopes.dashboards.collapse', 'Collapse') : t('scopes.dashboards.expand', 'Expand')
          }
          onClick={() => {
            onFolderUpdate(folderPath, !folder.expanded);
          }}
        >
          <Icon name={!folder.expanded ? 'angle-right' : 'angle-down'} {...stylex.props(scopesDashboardsTreeFolderItemStyles.icon)} />

          <span {...stylex.props(scopesDashboardsTreeFolderItemStyles.titleContainer)}>{folder.title}</span>
          {folder.loading && <Spinner inline size="sm" {...stylex.props(scopesDashboardsTreeFolderItemStyles.loadingIcon)} />}
        </button>

        {folder.subScopeName && !folder.disableSubScopeSelection && (
          <IconButton
            {...stylex.props(scopesDashboardsTreeFolderItemStyles.exchangeIcon)}
            tooltip={t('scopes.dashboards.exchange', 'Change root scope to {{scope}}', {
              scope: folder.subScopeName || '',
            })}
            name="exchange-alt"
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              if (folder.subScopeName && scopesSelectorService) {
                const activeSubScopePath = scopesDashboardsService?.state.navScopePath;
                // Check if the active scope is a child of the current folder's scope
                const activeScope = activeSubScopePath?.[activeSubScopePath.length - 1];
                const folderLocationInActivePath = activeSubScopePath?.indexOf(folder.subScopeName) ?? -1;

                await scopesDashboardsService?.setNavigationScope(
                  folderLocationInActivePath >= 0 ? folder.subScopeName : undefined,
                  undefined,
                  activeSubScopePath?.slice(folderLocationInActivePath + 1) ?? []
                );
                // Now changeScopes will skip fetchDashboards because navigationScope is set
                scopesSelectorService.changeScopes(
                  folderLocationInActivePath >= 0 && activeScope ? [activeScope] : [folder.subScopeName],
                  undefined,
                  undefined,
                  false
                );
              }
            }}
          />
        )}
      </div>

      {folder.expanded && (
        <div {...stylex.props(scopesDashboardsTreeFolderItemStyles.children)}>
          <ScopesDashboardsTree
            subScopePath={subScopePath}
            subScope={folder.subScopeName}
            folders={folders}
            folderPath={folderPath}
            onFolderUpdate={onFolderUpdate}
          />
        </div>
      )}
    </div>
  );
}

;
