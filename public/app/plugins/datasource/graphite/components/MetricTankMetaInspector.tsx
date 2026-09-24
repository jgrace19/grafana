import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { PureComponent } from 'react';

import { type MetadataInspectorProps, rangeUtil } from '@grafana/data';

import { metricTankMetaInspectorStyles } from './MetricTankMetaInspector.stylex';

import { type GraphiteDatasource } from '../datasource';
import { getRollupNotice, getRuntimeConsolidationNotice, parseSchemaRetentions } from '../meta';
import { type GraphiteOptions, type GraphiteQuery, type MetricTankSeriesMeta } from '../types';

export type Props = MetadataInspectorProps<GraphiteDatasource, GraphiteQuery, GraphiteOptions>;

export interface State {
  index: number;
}

export class MetricTankMetaInspector extends PureComponent<Props, State> {
  renderMeta(meta: MetricTankSeriesMeta, key: string) {
    const styles = metricTankMetaInspectorStyles;
    const buckets = parseSchemaRetentions(meta['schema-retentions']);
    const rollupNotice = getRollupNotice([meta]);
    const runtimeNotice = getRuntimeConsolidationNotice([meta]);
    const normFunc = (meta['consolidator-normfetch'] ?? '').replace('Consolidator', '');

    const totalSeconds = buckets.reduce(
      (acc, bucket) => acc + (bucket.retention ? rangeUtil.intervalToSeconds(bucket.retention) : 0),
      0
    );

    return (
      <div {...stylex.props(styles.metaItem)} key={key}>
        <div {...stylex.props(styles.metaItemHeader)}>
          Schema: {meta['schema-name']}
          <div className="small muted">Series count: {meta.count}</div>
        </div>
        <div {...stylex.props(styles.metaItemBody)}>
          <div {...stylex.props(styles.step)}>
            <div {...stylex.props(styles.stepHeading)}>Step 1: Fetch</div>
            <div {...stylex.props(styles.stepDescription)}>
              First data is fetched, either from raw data archive or a rollup archive
            </div>

            {rollupNotice && <p>{rollupNotice.text}</p>}
            {!rollupNotice && <p>No rollup archive was used</p>}

            <div>
              {buckets.map((bucket, index) => {
                const bucketLength = bucket.retention ? rangeUtil.intervalToSeconds(bucket.retention) : 0;
                const lengthPercent = (bucketLength / totalSeconds) * 100;
                const isActive = index === meta['archive-read'];

                return (
                  <div key={bucket.retention} {...stylex.props(styles.bucket)}>
                    <div {...stylex.props(styles.bucketInterval)}>{bucket.interval}</div>
                    <div
                      {...stylex.props(styles.bucketRetention, isActive && styles.bucketRetentionActive)}
                      style={{ flexGrow: lengthPercent }}
                    />
                    <div style={{ flexGrow: 100 - lengthPercent }}>{bucket.retention}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div {...stylex.props(styles.step)}>
            <div {...stylex.props(styles.stepHeading)}>Step 2: Normalization</div>
            <div {...stylex.props(styles.stepDescription)}>
              Normalization happens when series with different intervals between points are combined.
            </div>

            {meta['aggnum-norm'] > 1 && <p>Normalization did occur using {normFunc}</p>}
            {meta['aggnum-norm'] === 1 && <p>No normalization was needed</p>}
          </div>

          <div {...stylex.props(styles.step)}>
            <div {...stylex.props(styles.stepHeading)}>Step 3: Runtime consolidation</div>
            <div {...stylex.props(styles.stepDescription)}>
              If there are too many data points at this point Metrictank will consolidate them down to below max data
              points (set in queries tab).
            </div>

            {runtimeNotice && <p>{runtimeNotice.text}</p>}
            {!runtimeNotice && <p>No runtime consolidation</p>}
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { data } = this.props;

    // away to dedupe them
    const seriesMetas: Record<string, MetricTankSeriesMeta> = {};

    for (const series of data) {
      const seriesMetaList: MetricTankSeriesMeta[] | undefined = series?.meta?.custom?.seriesMetaList;
      if (seriesMetaList) {
        for (const metaItem of seriesMetaList) {
          // key is to dedupe as many series will have identitical meta
          const key = `${JSON.stringify(metaItem)}`;

          if (seriesMetas[key]) {
            seriesMetas[key].count += metaItem.count;
          } else {
            seriesMetas[key] = metaItem;
          }
        }
      }
    }

    if (Object.keys(seriesMetas).length === 0) {
      return <div>No response meta data</div>;
    }

    return (
      <div>
        <h2 className="page-heading">Metrictank Lineage</h2>
        {Object.keys(seriesMetas).map((key) => this.renderMeta(seriesMetas[key], key))}
      </div>
    );
  }
}

