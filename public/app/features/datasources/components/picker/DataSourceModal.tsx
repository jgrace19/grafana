import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { dataSourceModalStyles } from './DataSourceModal.stylex';
import { once } from 'lodash';
import { useEffect, useMemo, useRef, useState } from 'react';

import { type DataSourceInstanceSettings, type DataSourceRef, type GrafanaTheme2 } from '@grafana/data';
import { Trans, t } from '@grafana/i18n';
import { reportInteraction, useFavoriteDatasources } from '@grafana/runtime';
import { type DataQuery } from '@grafana/schema';
import { Modal, Input, Icon, ScrollContainer } from '@grafana/ui';
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
      {...stylex.props(dataSourceModalStyles.modal)}
      contentClassName={cn('modalContent')}
      onClickBackdrop={onDismissModal}
      onDismiss={onDismissModal}
    >
      <div {...stylex.props(dataSourceModalStyles.leftColumn)}>
        <Input
          type="search"
          autoFocus
          {...stylex.props(dataSourceModalStyles.searchInput)}
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
          <BuiltInList className={cn('appendBuiltInDataSourcesList')} />
        </ScrollContainer>
      </div>
      <div {...stylex.props(dataSourceModalStyles.rightColumn)}>
        <div {...stylex.props(dataSourceModalStyles.builtInDataSources)}>
          <div {...stylex.props(dataSourceModalStyles.builtInDataSourcesList)}>
            <ScrollContainer>
              <BuiltInList />
            </ScrollContainer>
          </div>
        </div>
        <div {...stylex.props(dataSourceModalStyles.newDSSection)}>
          <span {...stylex.props(dataSourceModalStyles.newDSDescription)}>
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

const cn = (key: keyof typeof dataSourceModalStyles) =>
  mergeStylexClassName(stylex.props(dataSourceModalStyles[key]), undefined).className ?? '';

function getDataSourceModalStyles(_theme: GrafanaTheme2) {
  return {
    modal: cn('modal'),
    modalContent: cn('modalContent'),
    leftColumn: cn('leftColumn'),
    rightColumn: cn('rightColumn'),
    builtInDataSources: cn('builtInDataSources'),
    builtInDataSourcesList: cn('builtInDataSourcesList'),
    appendBuiltInDataSourcesList: cn('appendBuiltInDataSourcesList'),
    newDSSection: cn('newDSSection'),
    newDSDescription: cn('newDSDescription'),
    searchInput: cn('searchInput'),
  };
}
