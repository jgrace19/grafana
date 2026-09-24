import * as stylex from '@stylexjs/stylex';
import { useObservable } from 'react-use';
import { Observable } from 'rxjs';

import { Trans, t } from '@grafana/i18n';
import { useScopes } from '@grafana/runtime';
import { Button, LoadingPlaceholder, ScrollContainer } from '@grafana/ui';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';

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
        <div {...stylex.props(styles.container)} data-testid="scopes-dashboards-container">
          <ScopesDashboardsTreeSearch disabled={loading} query={searchQuery} onChange={changeSearchQuery} />

          <div {...stylex.props(styles.noResultsContainer)} data-testid="scopes-dashboards-notFoundNoScopes">
            <Trans i18nKey="scopes.dashboards.noResultsNoScopes">No scopes selected</Trans>
          </div>
        </div>
      );
    } else if (dashboards.length === 0 && scopeNavigations.length === 0) {
      return (
        <div {...stylex.props(styles.container)} data-testid="scopes-dashboards-container">
          <div {...stylex.props(styles.noResultsContainer)} data-testid="scopes-dashboards-notFoundForScope">
            <Trans i18nKey="scopes.dashboards.noResultsForScopes">
              No dashboards or links found for the selected scopes
            </Trans>
          </div>
        </div>
      );
    }
  }

  return (
    <div {...stylex.props(styles.container)} data-testid="scopes-dashboards-container">
      <ScopesDashboardsTreeSearch disabled={loading} query={searchQuery} onChange={changeSearchQuery} />

      {loading ? (
        <LoadingPlaceholder
          className={stylex.props(styles.loadingIndicator).className}
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
        <p {...stylex.props(styles.noResultsContainer)} data-testid="scopes-dashboards-notFoundForFilter">
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

const styles = stylex.create({
  container: {
    backgroundColor: colors['--gf-colors-background-canvas'],
    borderRightWidth: '1px',
    borderRightStyle: 'solid',
    borderRightColor: colors['--gf-colors-border-weak'],
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    gap: spacing['--gf-spacing-x1'],
    paddingTop: 0,
    paddingRight: spacing['--gf-spacing-x2'],
    paddingBottom: 0,
    paddingLeft: spacing['--gf-spacing-x2'],
    marginTop: spacing['--gf-spacing-x2'],
    marginRight: 0,
    marginBottom: spacing['--gf-spacing-x2'],
    marginLeft: 0,
    width: `calc(${spacing['--gf-spacing-grid-size']} * 37.5)`,
  },
  noResultsContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: spacing['--gf-spacing-x1'],
    height: '100%',
    justifyContent: 'center',
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    textAlign: 'center',
  },
  loadingIndicator: {
    alignSelf: 'center',
  },
});
