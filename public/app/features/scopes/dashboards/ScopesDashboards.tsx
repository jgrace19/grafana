import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { scopesDashboardsStyles } from './ScopesDashboards.stylex';
import { useObservable } from 'react-use';
import { Observable } from 'rxjs';

import { Trans, t } from '@grafana/i18n';
import { useScopes } from '@grafana/runtime';
import { Button, LoadingPlaceholder, ScrollContainer } from '@grafana/ui';

import { useScopesServices } from '../ScopesContextProvider';

import { ScopesDashboardsTree } from './ScopesDashboardsTree';
import { ScopesDashboardsTreeSearch } from './ScopesDashboardsTreeSearch';

export function ScopesDashboards() {
  const scopes = useScopes();
  const scopeServices = useScopesServices();

  useObservable(
    scopeServices?.scopesDashboardsService.stateObservable ?? new Observable(),
    scopeServices?.scopesDashboardsService.state
  );

  if (!scopeServices || !scopes || !scopes.state.enabled || !scopes.state.drawerOpened || scopes.state.readOnly) {
    return null;
  }

  const { scopesDashboardsService } = scopeServices;
  const { loading, forScopeNames, dashboards, scopeNavigations, searchQuery, filteredFolders } =
    scopesDashboardsService.state;
  const { changeSearchQuery, updateFolder, clearSearchQuery } = scopesDashboardsService;

  if (!loading) {
    if (forScopeNames.length === 0) {
      return (
        <div {...stylex.props(scopesDashboardsStyles.container)} data-testid="scopes-dashboards-container">
          <ScopesDashboardsTreeSearch disabled={loading} query={searchQuery} onChange={changeSearchQuery} />

          <div {...stylex.props(scopesDashboardsStyles.noResultsContainer)} data-testid="scopes-dashboards-notFoundNoScopes">
            <Trans i18nKey="scopes.dashboards.noResultsNoScopes">No scopes selected</Trans>
          </div>
        </div>
      );
    } else if (dashboards.length === 0 && scopeNavigations.length === 0) {
      return (
        <div {...stylex.props(scopesDashboardsStyles.container)} data-testid="scopes-dashboards-container">
          <div {...stylex.props(scopesDashboardsStyles.noResultsContainer)} data-testid="scopes-dashboards-notFoundForScope">
            <Trans i18nKey="scopes.dashboards.noResultsForScopes">
              No dashboards or links found for the selected scopes
            </Trans>
          </div>
        </div>
      );
    }
  }

  return (
    <div {...stylex.props(scopesDashboardsStyles.container)} data-testid="scopes-dashboards-container">
      <ScopesDashboardsTreeSearch disabled={loading} query={searchQuery} onChange={changeSearchQuery} />

      {loading ? (
        <LoadingPlaceholder
          {...stylex.props(scopesDashboardsStyles.loadingIndicator)}
          text={t('scopes.dashboards.loading', 'Loading dashboards')}
          data-testid="scopes-dashboards-loading"
        />
      ) : filteredFolders[''] ? (
        <ScrollContainer>
          <ScopesDashboardsTree
            folders={filteredFolders}
            folderPath={['']}
            subScopePath={[]}
            onFolderUpdate={updateFolder}
          />
        </ScrollContainer>
      ) : (
        <p {...stylex.props(scopesDashboardsStyles.noResultsContainer)} data-testid="scopes-dashboards-notFoundForFilter">
          <Trans i18nKey="scopes.dashboards.noResultsForFilter">No results found for your query</Trans>

          <Button
            variant="secondary"
            onClick={clearSearchQuery}
            data-testid="scopes-dashboards-notFoundForFilter-clear"
          >
            <Trans i18nKey="scopes.dashboards.noResultsForFilterClear">Clear search</Trans>
          </Button>
        </p>
      )}
    </div>
  );
}

;
