import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { addCardButtonStyles } from './AddCardButton.stylex';
import { useCallback, useMemo, useState } from 'react';

import { CoreApp, type GrafanaTheme2 } from '@grafana/data';
import { t } from '@grafana/i18n';
import { config as grafanaConfig } from '@grafana/runtime';
import { type DataQuery } from '@grafana/schema';
import {Dropdown, Icon, Menu, Tooltip, useTheme2} from '@grafana/ui';
import { contextSrv } from 'app/core/services/context_srv';
import { useQueryLibraryContext } from 'app/features/explore/QueryLibrary/QueryLibraryContext';
import { SHARED_DASHBOARD_QUERY } from 'app/plugins/datasource/dashboard/constants';
import { AccessControlAction } from 'app/types/accessControl';

import {
  trackAddExpressionInitiated,
  trackAddQuery,
  trackAddTransformationInitiated,
  trackOpenSavedQueryPicker,
} from '../../tracking';
import { useActionsContext, useDatasourceContext, useQueryEditorUIContext } from '../QueryEditorContext';

function getButtonAriaLabel(variant: 'query' | 'transformation', afterId?: string) {
  if (variant === 'transformation') {
    return afterId
      ? t('query-editor-next.sidebar.add-transformation-below', 'Add transformation below {{id}}', { id: afterId })
      : t('query-editor-next.sidebar.add-transformation', 'Add transformation');
  }

  return afterId
    ? t('query-editor-next.sidebar.add-below', 'Add below {{id}}', { id: afterId })
    : t('query-editor-next.sidebar.add-query-or-expression', 'Add query or expression');
}

interface AddCardButtonProps {
  variant: 'query' | 'transformation';
  afterId?: string;
  alwaysVisible?: boolean;
  onAdd?: () => void;
}

export const AddCardButton = ({ variant, afterId, onAdd, alwaysVisible = false }: AddCardButtonProps) => {

  const theme = useTheme2();
  const { dsSettings } = useDatasourceContext();
  const { addQuery } = useActionsContext();
  const { setSelectedQuery, setPendingExpression, setPendingTransformation, setPendingSavedQuery } =
    useQueryEditorUIContext();
  const { openDrawer, queryLibraryEnabled } = useQueryLibraryContext();

  const [menuOpen, setMenuOpen] = useState(false);

  const isDashboardDs = dsSettings?.name === SHARED_DASHBOARD_QUERY;

  // When the savedQueriesRBAC feature toggle is enabled, access to the query
  // library is governed by fine-grained RBAC permissions. Otherwise, any
  // signed-in user can read saved queries (the pre-RBAC default).
  const canReadQueries = grafanaConfig.featureToggles.savedQueriesRBAC
    ? contextSrv.hasPermission(AccessControlAction.QueriesRead)
    : contextSrv.isSignedIn;

  const addAndSelectQuery = useCallback(
    (query?: Partial<DataQuery>) => {
      const newRefId = addQuery(query, afterId);
      if (newRefId) {
        const selectTarget: DataQuery = { refId: newRefId, hide: false };
        setSelectedQuery(selectTarget);
        onAdd?.();
      }
    },
    [addQuery, afterId, setSelectedQuery, onAdd]
  );

  const handleMenuVisibleChange = useCallback((visible: boolean) => {
    setMenuOpen(visible);
  }, []);

  const queryMenu = useMemo(
    () => (
      <Menu>
        <Menu.Item
          label={t('query-editor-next.sidebar.add-query', 'Add query')}
          icon="question-circle"
          onClick={() => {
            trackAddQuery('new_query', afterId ? 'inline' : 'section_header');
            addAndSelectQuery();
          }}
        />
        {queryLibraryEnabled && canReadQueries && (
          <Menu.Item
            label={t('query-editor-next.sidebar.add-saved-query', 'Add saved query')}
            icon="book-open"
            onClick={() => {
              const cardSource = afterId ? 'inline' : 'section_header';
              trackOpenSavedQueryPicker(cardSource);
              setPendingSavedQuery({ insertAfter: afterId ?? '' });
              openDrawer({
                onSelectQuery: (query) => {
                  trackAddQuery('saved_query', cardSource);
                  addAndSelectQuery(query);
                },
                options: { context: CoreApp.PanelEditor },
              });
            }}
          />
        )}
        {isDashboardDs ? (
          <Tooltip
            content={t(
              'query-editor-next.sidebar.add-expression-disabled',
              'Expressions are not supported with the Dashboard data source'
            )}
            placement="right"
          >
            <Menu.Item
              label={t('query-editor-next.sidebar.add-expression', 'Add expression')}
              icon="calculator-alt"
              disabled
            />
          </Tooltip>
        ) : (
          <Menu.Item
            label={t('query-editor-next.sidebar.add-expression', 'Add expression')}
            icon="calculator-alt"
            onClick={() => {
              trackAddExpressionInitiated(afterId ? 'inline' : 'section_header');
              setPendingExpression({ insertAfter: afterId ?? '' });
              onAdd?.();
            }}
          />
        )}
      </Menu>
    ),
    [
      queryLibraryEnabled,
      canReadQueries,
      isDashboardDs,
      addAndSelectQuery,
      setPendingSavedQuery,
      afterId,
      openDrawer,
      setPendingExpression,
      onAdd,
    ]
  );

  const handleTransformationClick = useCallback(() => {
    trackAddTransformationInitiated(afterId ? 'inline' : 'section_header');
    setPendingTransformation({ insertAfter: afterId });
    onAdd?.();
  }, [afterId, setPendingTransformation, onAdd]);

  const ariaLabel = getButtonAriaLabel(variant, afterId);

  const buttonStyles = stylex.props(
    addCardButtonStyles.button,
    alwaysVisible ? addCardButtonStyles.buttonAlwaysVisible : addCardButtonStyles.buttonHoverReveal
  );

  if (variant === 'transformation') {
    return (
      <button
        {...buttonStyles}
        data-add-button={!alwaysVisible || undefined}
        type="button"
        aria-label={ariaLabel}
        onClick={handleTransformationClick}
      >
        <Icon name="plus" size={alwaysVisible ? 'sm' : 'md'} />
      </button>
    );
  }

  return (
    <Dropdown
      overlay={queryMenu}
      placement={alwaysVisible ? 'bottom-start' : 'right-start'}
      offset={alwaysVisible ? [0, theme.spacing.gridSize * 0.5] : [theme.spacing.gridSize, 0]}
      onVisibleChange={handleMenuVisibleChange}
    >
      <button
        {...buttonStyles}
        data-add-button={!alwaysVisible || undefined}
        data-menu-open={menuOpen || undefined}
        type="button"
        aria-label={ariaLabel}
      >
        <Icon name="plus" size={alwaysVisible ? 'sm' : 'md'} />
      </button>
    </Dropdown>
  );
};


