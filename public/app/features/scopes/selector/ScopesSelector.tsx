import * as stylex from '@stylexjs/stylex';
import { useEffect } from 'react';
import { useObservable } from 'react-use';
import { Observable } from 'rxjs';

import { Trans, t } from '@grafana/i18n';
import { useScopes } from '@grafana/runtime';
import { Button, Drawer, ErrorBoundary, ErrorWithStack, Spinner, Text } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';
import { getModKey } from 'app/core/utils/browser';

import { useScopesServices } from '../ScopesContextProvider';

import { ScopesInput } from './ScopesInput';
import { type ScopesSelectorServiceState } from './ScopesSelectorService';
import { ScopesTree } from './ScopesTree';

export const ScopesSelector = () => {
  const scopes = useScopes();

  const services = useScopesServices();

  const selectorServiceState: ScopesSelectorServiceState | undefined = useObservable(
    services?.scopesSelectorService.stateObservable ?? new Observable(),
    services?.scopesSelectorService.state
  );

  // Keyboard shortcut for closing and applying
  useEffect(() => {
    if (!services?.scopesSelectorService) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      // ctrl/cmd + enter. Do a check up here to prevent conditional useEffect
      if (event.key === 'Enter' && event.metaKey) {
        services.scopesSelectorService.closeAndApply();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [services?.scopesSelectorService]);

  if (!services || !scopes || !scopes.state.enabled || !selectorServiceState) {
    return null;
  }

  const {
    nodes,
    loadingNodeName,
    opened,
    selectedScopes,
    appliedScopes,
    tree,
    scopes: scopesMap,
  } = selectorServiceState;
  const { scopesService, scopesSelectorService } = services;
  const { readOnly, loading } = scopes.state;
  const { open, removeAllScopes, closeAndApply, closeAndReset, getRecentScopes } = scopesSelectorService;

  const recentScopes = getRecentScopes();

  return (
    <>
      <ScopesInput
        nodes={nodes}
        scopes={scopesMap}
        appliedScopes={appliedScopes}
        disabled={readOnly}
        loading={loading}
        onInputClick={() => {
          if (!scopesService.state.readOnly) {
            open();
          }
        }}
        onRemoveAllClick={removeAllScopes}
      />

      {opened && (
        <Drawer title={t('scopes.selector.title', 'Select scopes')} size="sm" onClose={closeAndReset}>
          <ErrorBoundary boundaryName="scopes-selector">
            {({ error, errorInfo }) => {
              if (error) {
                return (
                  <ErrorWithStack
                    error={error}
                    title={t('scopes.selector.error-title', 'An unexpected error happened')}
                    errorInfo={errorInfo}
                  />
                );
              }
              return (
                <div {...stylex.props(styles.drawerContainer)}>
                  <div {...stylex.props(styles.treeContainer)}>
                    {loading || !tree ? (
                      <Spinner data-testid="scopes-selector-loading" />
                    ) : (
                      <>
                        <ScopesTree
                          tree={tree}
                          loadingNodeName={loadingNodeName}
                          recentScopes={recentScopes}
                          selectedScopes={selectedScopes}
                          scopeNodes={nodes}
                          onRecentScopesSelect={(scopeIds: string[], parentNodeId?: string, scopeNodeId?: string) => {
                            scopesSelectorService.changeScopes(scopeIds, parentNodeId, scopeNodeId);
                            scopesSelectorService.closeAndReset();
                          }}
                        />
                      </>
                    )}
                  </div>

                  <div {...stylex.props(styles.buttonsContainer)}>
                    <Button variant="primary" data-testid="scopes-selector-apply" onClick={closeAndApply}>
                      <Trans i18nKey="scopes.selector.apply">Apply</Trans>&nbsp;
                      <Text variant="bodySmall">{`${getModKey()}+↵`}</Text>
                    </Button>
                    <Button variant="secondary" data-testid="scopes-selector-cancel" onClick={closeAndReset}>
                      <Trans i18nKey="scopes.selector.cancel">Cancel</Trans>
                    </Button>
                  </div>
                </div>
              );
            }}
          </ErrorBoundary>
        </Drawer>
      )}
    </>
  );
};

const styles = stylex.create({
  drawerContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  treeContainer: {
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '100%',
    overflowY: 'hidden',
    // Fix for top level search outline overflow due to scrollbars
    paddingLeft: spacing['--gf-spacing-x0-5'],
  },
  buttonsContainer: {
    display: 'flex',
    gap: spacing['--gf-spacing-x1'],
    marginTop: spacing['--gf-spacing-x8'],
  },
});
