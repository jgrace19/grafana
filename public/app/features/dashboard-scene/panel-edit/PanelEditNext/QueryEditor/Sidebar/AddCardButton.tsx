import * as stylex from '@stylexjs/stylex';
import { useCallback, useMemo, useState } from 'react';

import { CoreApp } from '@grafana/data';
import { t } from '@grafana/i18n';
import { config as grafanaConfig } from '@grafana/runtime';
import { type DataQuery } from '@grafana/schema';
import { Dropdown, Icon, Menu, Tooltip, useTheme2 } from '@grafana/ui';
import { motion } from '@grafana/ui/stylex/constants.stylex';
import { colors, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';
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

import { sidebarCardMarker } from './markers.stylex';

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

  if (variant === 'transformation') {
    return (
      <button
        {...stylex.props(styles.button, alwaysVisible ? styles.alwaysVisible : styles.revealOnCardHover)}
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
        {...stylex.props(
          styles.button,
          alwaysVisible ? styles.alwaysVisible : styles.revealOnCardHover,
          !alwaysVisible && menuOpen && styles.revealed
        )}
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

const revealTransition = 'opacity, background-color, transform';

const styles = stylex.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: spacing['--gf-spacing-x2-5'],
    height: spacing['--gf-spacing-x2-5'],
    borderRadius: shape['--gf-shape-radius-sm'],
    borderStyle: 'none',
    backgroundColor: { default: colors['--gf-colors-primary-main'], ':hover': colors['--gf-colors-primary-shade'] },
    color: colors['--gf-colors-primary-contrast-text'],
    cursor: 'pointer',
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    willChange: 'transform',
    outlineWidth: { default: null, ':focus-visible': '2px' },
    outlineStyle: { default: null, ':focus-visible': 'solid' },
    outlineColor: { default: null, ':focus-visible': colors['--gf-colors-primary-border'] },
    outlineOffset: { default: null, ':focus-visible': '2px' },
  },
  // Header "+" buttons.
  alwaysVisible: {
    display: 'inline-flex',
    transform: { default: 'translateZ(0)', ':active': 'scale(0.97)' },
    // On :focus-visible the global `button:focus-visible` transition applies instead, as it did with Emotion.
    transitionProperty: {
      default: null,
      [motion.noPreferenceOrReduce]: { default: null, ':not(:focus-visible)': 'background-color, transform' },
    },
    transitionDuration: {
      default: null,
      [motion.noPreferenceOrReduce]: { default: null, ':not(:focus-visible)': '100ms, 250ms' },
    },
    transitionTimingFunction: {
      default: null,
      [motion.noPreferenceOrReduce]: {
        default: null,
        ':not(:focus-visible)': 'cubic-bezier(0.4, 0, 0.2, 1), cubic-bezier(0.25, 1, 0.5, 1)',
      },
    },
  },
  // Inline "+" below a card: hidden until the card is hovered, the button has keyboard focus, or its menu is open.
  revealOnCardHover: {
    display: 'flex',
    transform: { default: 'translateY(-50%) translateZ(0)', ':active': 'translateY(-50%) scale(0.97)' },
    transitionProperty: {
      default: null,
      [motion.noPreferenceOrReduce]: { default: null, ':not(:focus-visible)': revealTransition },
    },
    transitionDuration: {
      default: null,
      [motion.noPreferenceOrReduce]: { default: null, ':not(:focus-visible)': '100ms, 100ms, 250ms' },
    },
    transitionTimingFunction: {
      default: null,
      [motion.noPreferenceOrReduce]: {
        default: null,
        ':not(:focus-visible)':
          'cubic-bezier(0.4, 0, 0.2, 1), cubic-bezier(0.4, 0, 0.2, 1), cubic-bezier(0.25, 1, 0.5, 1)',
      },
    },
    position: 'absolute',
    top: `calc(100% + ${spacing['--gf-spacing-x0-25']})`,
    left: `calc(-1 * ${spacing['--gf-spacing-x2-5']})`,
    zIndex: 1,
    opacity: { default: 0, ':focus-visible': 1, [stylex.when.ancestor(':hover', sidebarCardMarker)]: 1 },
    pointerEvents: {
      default: 'none',
      ':focus-visible': 'auto',
      [stylex.when.ancestor(':hover', sidebarCardMarker)]: 'auto',
    },
  },
  revealed: {
    opacity: 1,
    pointerEvents: 'auto',
  },
});
