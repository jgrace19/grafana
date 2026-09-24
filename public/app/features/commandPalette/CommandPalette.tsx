import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { commandPaletteStyles } from './CommandPalette.stylex';
import { useDialog } from '@react-aria/dialog';
import { FocusScope } from '@react-aria/focus';
import { useOverlay } from '@react-aria/overlays';
import { KBarAnimator, KBarPortal, KBarPositioner, VisualState, useKBar, ActionImpl } from 'kbar';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import { OpenAssistantButton, useAssistant } from '@grafana/assistant';
import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';
import { reportInteraction } from '@grafana/runtime';
import { EmptyState, Icon, LoadingBar } from '@grafana/ui';

import { KBarResults } from './KBarResults';
import { KBarSearch } from './KBarSearch';
import { ResultItem } from './ResultItem';
import { useSearchResults } from './actions/dashboardActions';
import { useRegisterRecentDashboardsActions, useRegisterStaticActions } from './actions/useActions';
import { useRegisterRecentScopesActions, useRegisterScopesActions } from './scopes/scopeActions';
import { type CommandPaletteAction } from './types';
import { useMatches } from './useMatches';

export function CommandPalette() {
  useRegisterStaticActions();
  return (
    <KBarPortal>
      <CommandPaletteContents />
    </KBarPortal>
  );
}

/**
 * Actual contents of the command palette. As KBarPortal controls the mount of this component this is split so that
 * we can run code only after command palette is opened.
 * @constructor
 */
function CommandPaletteContents() {
  const lateralSpace = getCommandPalettePosition();
  const styles = (getSearchStyles, lateralSpace);

  const { query, searchQuery, currentRootActionId } = useKBar((state) => ({
    showing: state.visualState === VisualState.showing,
    searchQuery: state.searchQuery,
    currentRootActionId: state.currentRootActionId,
  }));

  useRegisterRecentDashboardsActions();
  useRegisterRecentScopesActions();

  const queryToggle = useCallback(() => query.toggle(), [query]);
  const { scopesRow } = useRegisterScopesActions(searchQuery, queryToggle, currentRootActionId);

  // This searches dashboards and folders it shows only if we are not in some specific category (and there is no
  // dashboards category right now, so if any category is selected, we don't show these).
  // Normally we register actions with kbar, and it knows not to show actions which are under a different parent than is
  // the currentRootActionId. Because these search results are manually added to the list later, they would show every
  // time.
  const { searchResults, isFetchingSearchResults } = useSearchResults({ searchQuery, show: !currentRootActionId });

  const ref = useRef<HTMLDivElement>(null);
  const { overlayProps } = useOverlay(
    { isOpen: true, onClose: () => query.setVisualState(VisualState.animatingOut) },
    ref
  );

  const { dialogProps } = useDialog({}, ref);

  // Report interaction when opened
  useEffect(() => {
    reportInteraction('command_palette_opened');
  }, []);

  return (
    <KBarPositioner {...stylex.props(commandPaletteStyles.positioner)}>
      <KBarAnimator {...stylex.props(commandPaletteStyles.animator)}>
        <FocusScope contain autoFocus restoreFocus>
          <div {...overlayProps} {...dialogProps}>
            <div {...stylex.props(commandPaletteStyles.searchContainer)}>
              <Icon name="search" size="md" {...stylex.props(commandPaletteStyles.searchIcon)} />
              <AncestorBreadcrumbs />
              <KBarSearch
                defaultPlaceholder={t('command-palette.search-box.placeholder', 'Search or jump to...')}
                {...stylex.props(commandPaletteStyles.search)}
              />
              <div {...stylex.props(commandPaletteStyles.loadingBarContainer)}>
                {isFetchingSearchResults && <LoadingBar width={500} delay={0} />}
              </div>
            </div>
            {scopesRow ? <div {...stylex.props(commandPaletteStyles.searchContainer)}>{scopesRow}</div> : null}
            <div {...stylex.props(commandPaletteStyles.resultsContainer)}>
              <RenderResults
                isFetchingSearchResults={isFetchingSearchResults}
                searchResults={searchResults}
                searchQuery={searchQuery}
              />
            </div>
          </div>
        </FocusScope>
      </KBarAnimator>
    </KBarPositioner>
  );
}

/**
 * Breadcrumbs for selected actions or categories in the command palette. This has to be a separate component
 * from the one that is registering actions because we need actions prop from kbar and doing both in the same component
 * creates rerender loop.
 * @constructor
 */
function AncestorBreadcrumbs() {
  const lateralSpace = getCommandPalettePosition();
  const styles = (getSearchStyles, lateralSpace);

  const { actions, currentRootActionId } = useKBar((state) => ({
    actions: state.actions,
    currentRootActionId: state.currentRootActionId,
  }));

  // To show breadcrumbs of actions selected if they are nested
  const ancestorActions = currentRootActionId
    ? [...actions[currentRootActionId].ancestors, actions[currentRootActionId]]
    : [];

  return (
    ancestorActions.length > 0 && (
      <span {...stylex.props(commandPaletteStyles.breadcrumbs)}>
        {ancestorActions.map((action, index) => (
          <React.Fragment key={action.id || index}>{action.name}&nbsp;/&nbsp;</React.Fragment>
        ))}
      </span>
    )
  );
}

interface RenderResultsProps {
  isFetchingSearchResults: boolean;
  searchResults: CommandPaletteAction[];
  searchQuery: string;
}

const RenderResults = ({ isFetchingSearchResults, searchResults, searchQuery }: RenderResultsProps) => {
  const { results: kbarResults, rootActionId } = useMatches();
  const { query } = useKBar();
  const { isAvailable: isAssistantAvailable } = useAssistant();
  const lateralSpace = getCommandPalettePosition();
  const styles = (getSearchStyles, lateralSpace);

  const dashboardsSectionTitle = t('command-palette.section.dashboard-search-results', 'Dashboards');
  const foldersSectionTitle = t('command-palette.section.folder-search-results', 'Folders');
  // because dashboard search results aren't registered as actions, we need to manually
  // convert them to ActionImpls before passing them as items to KBarResults
  const dashboardResultItems = useMemo(
    () =>
      searchResults
        .filter((item) => item.id.startsWith('go/dashboard'))
        .map((dashboard) => new ActionImpl(dashboard, { store: {} })),
    [searchResults]
  );
  const folderResultItems = useMemo(
    () =>
      searchResults
        .filter((item) => item.id.startsWith('go/folder'))
        .map((folder) => new ActionImpl(folder, { store: {} })),
    [searchResults]
  );

  const items = useMemo(() => {
    const results = [...kbarResults];
    if (folderResultItems.length > 0) {
      results.push(foldersSectionTitle);
      results.push(...folderResultItems);
    }
    if (dashboardResultItems.length > 0) {
      results.push(dashboardsSectionTitle);
      results.push(...dashboardResultItems);
    }
    return results;
  }, [kbarResults, dashboardsSectionTitle, dashboardResultItems, foldersSectionTitle, folderResultItems]);

  const showEmptyState = !isFetchingSearchResults && items.length === 0;
  useEffect(() => {
    showEmptyState && reportInteraction('grafana_empty_state_shown', { source: 'command_palette' });
  }, [showEmptyState]);

  return showEmptyState ? (
    <EmptyState variant="not-found" role="alert" message={t('command-palette.empty-state.message', 'No results found')}>
      {isAssistantAvailable && (
        <OpenAssistantButton
          origin="grafana/command-palette-empty-state"
          prompt={`Search for ${searchQuery}`}
          title={t('command-palette.empty-state.button-title', 'Search with Grafana Assistant')}
          onClick={query.toggle}
        />
      )}
    </EmptyState>
  ) : (
    <KBarResults
      items={items}
      maxHeight={650}
      onRender={({ item, active }) => {
        const isFirst = items[0] === item;

        const renderedItem =
          typeof item === 'string' ? (
            <div {...mergeStylexClassName(stylex.props(commandPaletteStyles.sectionHeader, isFirst && commandPaletteStyles.sectionHeaderFirst), undefined)}>{item}</div>
          ) : (
            <ResultItem action={item} active={active} currentRootActionId={rootActionId!} />
          );

        return renderedItem;
      }}
    />
  );
};

const getCommandPalettePosition = () => {
  const input = document.querySelector(`[data-testid="${selectors.components.NavToolbar.commandPaletteTrigger}"]`);
  const inputRightPosition = input?.getBoundingClientRect().right ?? 0;
  const screenWidth = document.body.clientWidth;
  const lateralSpace = screenWidth - inputRightPosition;
  return lateralSpace;
};

;
