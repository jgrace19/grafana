// eslint-disable-next-line no-restricted-imports -- stylex: pending Modal migration
import { css } from '@emotion/css';
import * as stylex from '@stylexjs/stylex';
import { once } from 'lodash';
import { useEffect, useMemo, useRef, useState } from 'react';

import { type DataSourceInstanceSettings, type DataSourceRef } from '@grafana/data';
import { Trans, t } from '@grafana/i18n';
import { reportInteraction, useFavoriteDatasources } from '@grafana/runtime';
import { type DataQuery } from '@grafana/schema';
import { Modal, Input, Icon, ScrollContainer } from '@grafana/ui';
import { bp } from '@grafana/ui/stylex/constants.stylex';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';
import { type GrafanaQuery } from 'app/plugins/datasource/grafana/types';

import { useDatasources } from '../../hooks';

import { AddNewDataSourceButton } from './AddNewDataSourceButton';
import { BuiltInDataSourceList } from './BuiltInDataSourceList';
import { DataSourceList } from './DataSourceList';
import { matchDataSourceWithSearch } from './utils';

const INTERACTION_EVENT_NAME = 'dashboards_dspickermodal_clicked';
const INTERACTION_ITEM = {
  SELECT_DS: 'select_ds',
  CONFIG_NEW_DS: 'config_new_ds',
  CONFIG_NEW_DS_EMPTY_STATE: 'config_new_ds_empty_state',
  SEARCH: 'search',
  DISMISS: 'dismiss',
  OPEN_MODAL: 'open_modal',
};

export interface DataSourceModalProps {
  onChange: (ds: DataSourceInstanceSettings, defaultQueries?: DataQuery[] | GrafanaQuery[]) => void;
  current: DataSourceRef | string | null | undefined;
  onDismiss: () => void;
  recentlyUsed?: string[];
  reportedInteractionFrom?: string;

  // DS filters
  filter?: (ds: DataSourceInstanceSettings) => boolean;
  tracing?: boolean;
  mixed?: boolean;
  dashboard?: boolean;
  metrics?: boolean;
  type?: string | string[];
  annotations?: boolean;
  variables?: boolean;
  alerting?: boolean;
  pluginId?: string;
  logs?: boolean;
}

export function DataSourceModal({
  tracing,
  dashboard,
  mixed,
  metrics,
  type,
  annotations,
  variables,
  alerting,
  pluginId,
  logs,
  filter,
  onChange,
  current,
  onDismiss,
  reportedInteractionFrom,
}: DataSourceModalProps) {
  const [search, setSearch] = useState('');
  const analyticsInteractionSrc = reportedInteractionFrom || 'modal';
  const favoriteDataSources = useFavoriteDatasources();
  const scrollRef = useRef<HTMLDivElement>(null);

  const onDismissModal = () => {
    onDismiss();
    reportInteraction(INTERACTION_EVENT_NAME, { item: INTERACTION_ITEM.DISMISS, src: analyticsInteractionSrc });
  };
  const onChangeDataSource = (ds: DataSourceInstanceSettings) => {
    onChange(ds);
    reportInteraction(INTERACTION_EVENT_NAME, {
      item: INTERACTION_ITEM.SELECT_DS,
      ds_type: ds.type,
      src: analyticsInteractionSrc,
      is_favorite: favoriteDataSources.enabled ? favoriteDataSources.isFavoriteDatasource(ds.uid) : undefined,
    });
  };

  // Get all datasources to report total_configured count
  const dataSources = useDatasources({
    tracing,
    dashboard,
    mixed,
    metrics,
    type,
    annotations,
    variables,
    alerting,
    pluginId,
    logs,
  });

  // Report interaction when modal is opened
  useEffect(() => {
    if (dataSources.length > 0) {
      reportInteraction(INTERACTION_EVENT_NAME, {
        item: INTERACTION_ITEM.OPEN_MODAL,
        src: analyticsInteractionSrc,
        creator_team: 'grafana_plugins_catalog',
        schema_version: '1.0.0',
        total_configured: dataSources.length,
      });
    }
  }, [analyticsInteractionSrc, dataSources.length]);

  // Memoizing to keep once() cached so it avoids reporting multiple times
  const reportSearchUsageOnce = useMemo(
    () =>
      once(() => {
        reportInteraction(INTERACTION_EVENT_NAME, { item: 'search', src: analyticsInteractionSrc });
      }),
    [analyticsInteractionSrc]
  );

  // Built-in data sources used twice because of mobile layout adjustments
  // In movile the list is appended to the bottom of the DS list
  const BuiltInList = ({ className }: { className?: string }) => {
    return (
      <BuiltInDataSourceList
        className={className}
        onChange={onChangeDataSource}
        current={current}
        filter={filter}
        variables={variables}
        tracing={tracing}
        metrics={metrics}
        type={type}
        annotations={annotations}
        alerting={alerting}
        pluginId={pluginId}
        logs={logs}
        dashboard={dashboard}
        mixed={mixed}
      />
    );
  };

  return (
    <Modal
      title={t('data-source-picker.modal.title', 'Select data source')}
      closeOnEscape={true}
      closeOnBackdropClick={true}
      isOpen={true}
      className={modalClassName}
      contentClassName={stylex.props(styles.modalContent).className}
      onClickBackdrop={onDismissModal}
      onDismiss={onDismissModal}
    >
      <div {...stylex.props(styles.leftColumn)}>
        <Input
          type="search"
          autoFocus
          className={stylex.props(styles.searchInput).className}
          value={search}
          prefix={<Icon name="search" />}
          placeholder={t('data-source-picker.modal.input-placeholder', 'Select data source')}
          onChange={(e) => {
            setSearch(e.currentTarget.value);
            reportSearchUsageOnce();
          }}
        />
        <ScrollContainer ref={scrollRef}>
          <DataSourceList
            onChange={onChangeDataSource}
            current={current}
            onClickEmptyStateCTA={() =>
              reportInteraction(INTERACTION_EVENT_NAME, {
                item: INTERACTION_ITEM.CONFIG_NEW_DS_EMPTY_STATE,
                src: analyticsInteractionSrc,
              })
            }
            filter={(ds) => (filter ? filter?.(ds) : true) && matchDataSourceWithSearch(ds, search) && !ds.meta.builtIn}
            variables={variables}
            tracing={tracing}
            metrics={metrics}
            type={type}
            annotations={annotations}
            alerting={alerting}
            pluginId={pluginId}
            logs={logs}
            dashboard={dashboard}
            mixed={mixed}
            dataSources={dataSources}
            favoriteDataSources={favoriteDataSources}
            scrollRef={scrollRef}
          />
          <BuiltInList className={stylex.props(styles.appendBuiltInDataSourcesList).className} />
        </ScrollContainer>
      </div>
      <div {...stylex.props(styles.rightColumn)}>
        <div {...stylex.props(styles.builtInDataSources)}>
          <div {...stylex.props(styles.builtInDataSourcesList)}>
            <ScrollContainer>
              <BuiltInList />
            </ScrollContainer>
          </div>
        </div>
        <div {...stylex.props(styles.newDSSection)}>
          <span {...stylex.props(styles.newDSDescription)}>
            <Trans i18nKey="data-source-picker.modal.configure-new-data-source">
              Open a new tab and configure a data source
            </Trans>
          </span>
          <AddNewDataSourceButton
            variant="secondary"
            onClick={() => {
              reportInteraction(INTERACTION_EVENT_NAME, {
                item: INTERACTION_ITEM.CONFIG_NEW_DS,
                src: analyticsInteractionSrc,
              });
              onDismiss();
            }}
          />
        </div>
      </div>
    </Modal>
  );
}

// stylex: pending Modal migration. Modal's own Emotion width would beat a layered StyleX class.
const modalClassName = css({
  width: '80%',
  maxWidth: '1200px',
  minHeight: '80%',

  [bp.mdDown]: {
    width: '100%',
  },
});

const styles = stylex.create({
  modalContent: {
    display: 'flex',
    flexDirection: { default: 'row', [bp.mdDown]: 'column' },
    flex: '1',
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    width: { default: '50%', [bp.mdDown]: '100%' },
    maxHeight: '100%',
    paddingRight: { default: spacing['--gf-spacing-x4'], [bp.mdDown]: 0 },
    borderRightWidth: { default: '1px', [bp.mdDown]: 0 },
    borderRightStyle: 'solid',
    borderRightColor: colors['--gf-colors-border-weak'],
    flex: { default: null, [bp.mdDown]: '1' },
    overflowY: { default: null, [bp.mdDown]: 'auto' },
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    width: { default: '50%', [bp.mdDown]: '100%' },
    minHeight: '100%',
    alignItems: 'stretch',
    paddingLeft: { default: spacing['--gf-spacing-x4'], [bp.mdDown]: 0 },
    flexShrink: { default: null, [bp.mdDown]: 0 },
  },
  builtInDataSources: {
    flexGrow: '1',
    flexShrink: '1',
    flexBasis: '0%',
    display: { default: null, [bp.mdDown]: 'none' },
  },
  builtInDataSourcesList: {
    display: { default: null, [bp.mdDown]: 'none' },
    marginBottom: { default: spacing['--gf-spacing-x4'], [bp.mdDown]: 0 },
  },
  appendBuiltInDataSourcesList: {
    display: { default: null, [bp.mdUp]: 'none' },
  },
  newDSSection: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing['--gf-spacing-x1'],
  },
  newDSDescription: {
    flexGrow: '1',
    flexShrink: '0',
    flexBasis: '0%',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    color: colors['--gf-colors-text-secondary'],
    visibility: { default: null, [bp.smDown]: 'hidden' },
  },
  searchInput: {
    width: '100%',
    minHeight: '32px',
    marginBottom: spacing['--gf-spacing-x1'],
  },
});
