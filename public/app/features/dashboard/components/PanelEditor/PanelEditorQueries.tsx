import { useEffect, useState } from 'react';

import { type DataQuery, getDataSourceRef } from '@grafana/data';
import { locationService } from '@grafana/runtime';
import { storeLastUsedDataSourceInLocalStorage } from 'app/features/datasources/components/picker/utils';
import { getDatasourceSrv } from 'app/features/plugins/datasource_srv';
import { QueryGroup } from 'app/features/query/components/QueryGroup';
import { type QueryGroupDataSource, type QueryGroupOptions } from 'app/types/query';

import { getDashboardSrv } from '../../services/DashboardSrv';
import { type PanelModel } from '../../state/PanelModel';
import { getLastUsedDatasourceFromStorage } from '../../utils/dashboard';

interface Props {
  /** Current panel */
  panel: PanelModel;
  /** Added here to make component re-render when queries change from outside */
  queries: DataQuery[];
}

export function PanelEditorQueries({ panel }: Props) {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    // If the panel model has no datasource property load the default data source property and update the persisted model
    if (!panel.datasource) {
      (async () => {
        let ds;
        const dashboardUid = getDashboardSrv().getCurrent()?.uid ?? '';
        const lastUsedDatasource = getLastUsedDatasourceFromStorage(dashboardUid!);
        if (lastUsedDatasource?.datasourceUid !== null) {
          ds = getDatasourceSrv().getInstanceSettings(lastUsedDatasource?.datasourceUid);
        }
        if (!ds) {
          ds = getDatasourceSrv().getInstanceSettings(null);
        }
        panel.datasource = getDataSourceRef(ds!);
        forceUpdate((c) => c + 1);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateLastUsedDatasource = (datasource: QueryGroupDataSource) => {
    storeLastUsedDataSourceInLocalStorage(datasource);
  };

  const buildQueryOptions = (): QueryGroupOptions => {
    const dataSource: QueryGroupDataSource = panel.datasource ?? {
      default: true,
    };
    const datasourceSettings = getDatasourceSrv().getInstanceSettings(dataSource);

    updateLastUsedDatasource(dataSource);
    return {
      cacheTimeout: datasourceSettings?.meta.queryOptions?.cacheTimeout ? panel.cacheTimeout : undefined,
      dataSource: {
        default: datasourceSettings?.isDefault,
        ...(datasourceSettings ? getDataSourceRef(datasourceSettings) : { type: undefined, uid: undefined }),
      },
      queryCachingTTL: datasourceSettings?.cachingConfig?.enabled ? panel.queryCachingTTL : undefined,
      queries: panel.targets,
      maxDataPoints: panel.maxDataPoints,
      minInterval: panel.interval,
      timeRange: {
        from: panel.timeFrom,
        shift: panel.timeShift,
        hide: panel.hideTimeOverride,
      },
    };
  };

  const onRunQueries = () => {
    panel.refresh();
  };

  const onOpenQueryInspector = () => {
    locationService.partial({
      inspect: panel.id,
      inspectTab: 'query',
    });
  };

  const onOptionsChange = (options: QueryGroupOptions) => {
    panel.updateQueries(options);

    if (options.dataSource.uid !== panel.datasource?.uid) {
      setTimeout(onRunQueries, 10);
    }

    forceUpdate((c) => c + 1);
  };

  if (!panel.datasource) {
    return null;
  }

  const options = buildQueryOptions();

  return (
    <QueryGroup
      options={options}
      queryRunner={panel.getQueryRunner()}
      onRunQueries={onRunQueries}
      onOpenQueryInspector={onOpenQueryInspector}
      onOptionsChange={onOptionsChange}
    />
  );
}
