import * as stylex from '@stylexjs/stylex';

import { urlUtil } from '@grafana/data';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';
import { useQueryParams } from 'app/core/hooks/useQueryParams';

import { ScopesDashboardsTreeFolderItem } from './ScopesDashboardsTreeFolderItem';
import { ScopesNavigationTreeLink } from './ScopesNavigationTreeLink';
import { type OnFolderUpdate, type SuggestedNavigationsFoldersMap } from './types';

export interface ScopesDashboardsTreeProps {
  subScope?: string;
  folders: SuggestedNavigationsFoldersMap;
  folderPath: string[];
  subScopePath?: string[];
  onFolderUpdate: OnFolderUpdate;
}

export function ScopesDashboardsTree({
  subScopePath,
  subScope,
  folders,
  folderPath,
  onFolderUpdate,
}: ScopesDashboardsTreeProps) {
  const [queryParams] = useQueryParams();

  const folderId = folderPath[folderPath.length - 1];
  const folder = folders[folderId];

  // Separate regular items from subScope items
  const regularFolders: Array<[string, (typeof folder.folders)[string]]> = [];
  const subScopeFolders: Array<[string, (typeof folder.folders)[string]]> = [];

  Object.entries(folder.folders).forEach(([subFolderId, subFolder]) => {
    if (subFolder.subScopeName) {
      subScopeFolders.push([subFolderId, subFolder]);
    } else {
      regularFolders.push([subFolderId, subFolder]);
    }
  });

  const regularNavigations = Object.values(folder.suggestedNavigations);

  const hasRegularContent = regularFolders.length > 0 || regularNavigations.length > 0;
  const hasSubScopeContent = subScopeFolders.length > 0;

  return (
    <div role="tree">
      {/* Regular folders and navigations */}
      {regularFolders.map(([subFolderId, subFolder]) => (
        <ScopesDashboardsTreeFolderItem
          key={subFolderId}
          folder={subFolder}
          folders={folder.folders}
          folderPath={[...folderPath, subFolderId]}
          onFolderUpdate={onFolderUpdate}
        />
      ))}
      {regularNavigations.map((navigation) => (
        <ScopesNavigationTreeLink
          subScope={subScope}
          subScopePath={subScopePath}
          key={navigation.id + navigation.title}
          to={urlUtil.renderUrl(navigation.url, queryParams)}
          title={navigation.title}
          id={navigation.id}
        />
      ))}

      {/* Separator between regular and subScope sections */}
      {hasRegularContent && hasSubScopeContent && <hr {...stylex.props(styles.separator)} />}

      {/* SubScope folders */}
      {subScopeFolders.map(([subFolderId, subFolder]) => (
        <ScopesDashboardsTreeFolderItem
          key={subFolderId}
          subScopePath={[...(subScopePath ?? []), subFolder.subScopeName ?? '']}
          folder={subFolder}
          folders={folder.folders}
          folderPath={[...folderPath, subFolderId]}
          onFolderUpdate={onFolderUpdate}
        />
      ))}
    </div>
  );
}

const styles = stylex.create({
  separator: {
    borderStyle: 'none',
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: colors['--gf-colors-border-weak'],
    marginTop: spacing['--gf-spacing-x1'],
    marginRight: 0,
    marginBottom: spacing['--gf-spacing-x1'],
    marginLeft: 0,
  },
});
