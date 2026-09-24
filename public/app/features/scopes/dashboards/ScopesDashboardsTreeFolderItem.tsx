import * as stylex from '@stylexjs/stylex';

import { t } from '@grafana/i18n';
import { Icon, IconButton, Spinner } from '@grafana/ui';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';

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
  // get scopesselector service
  const scopesSelectorService = useScopesServices()?.scopesSelectorService ?? undefined;
  const scopesDashboardsService = useScopesServices()?.scopesDashboardsService ?? undefined;
  return (
    <div {...stylex.props(styles.container)} role="treeitem" aria-selected={folder.expanded}>
      <div {...stylex.props(styles.row)}>
        <button
          {...stylex.props(styles.expand)}
          data-testid={`scopes-dashboards-${folder.title}-expand`}
          aria-label={
            folder.expanded ? t('scopes.dashboards.collapse', 'Collapse') : t('scopes.dashboards.expand', 'Expand')
          }
          onClick={() => {
            onFolderUpdate(folderPath, !folder.expanded);
          }}
        >
          <Icon name={!folder.expanded ? 'angle-right' : 'angle-down'} xstyle={styles.icon} />

          <span {...stylex.props(styles.titleContainer)}>{folder.title}</span>
          {folder.loading && <Spinner inline size="sm" className={stylex.props(styles.loadingIcon).className} />}
        </button>

        {folder.subScopeName && !folder.disableSubScopeSelection && (
          <IconButton
            xstyle={styles.exchangeIcon}
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
        <div {...stylex.props(styles.children)}>
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

const styles = stylex.create({
  exchangeIcon: {
    opacity: 0.7,
    flexShrink: 0,
    marginTop: spacing['--gf-spacing-x0-25'],
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: spacing['--gf-spacing-x0-5'],
    paddingRight: 0,
    paddingBottom: spacing['--gf-spacing-x0-5'],
    paddingLeft: 0,
  },
  row: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: spacing['--gf-spacing-x1'],
    width: '100%',
  },
  expand: {
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    backgroundImage: 'none',
    borderWidth: 0,
    borderStyle: 'none',
    display: 'flex',
    gap: spacing['--gf-spacing-x1'],
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    textAlign: 'left',
    wordBreak: 'break-word',
    flex: '1',
  },
  icon: {
    marginTop: spacing['--gf-spacing-x0-25'],
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    flex: '1',
  },
  loadingIcon: {
    flexShrink: 0,
    marginLeft: spacing['--gf-spacing-x0-5'],
    marginTop: spacing['--gf-spacing-x0-25'],
  },
  children: {
    paddingLeft: spacing['--gf-spacing-x2'],
    marginLeft: spacing['--gf-spacing-x1'],
    borderLeftWidth: '1px',
    borderLeftStyle: 'solid',
    borderLeftColor: colors['--gf-colors-border-weak'],
  },
});
