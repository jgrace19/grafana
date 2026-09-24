import * as stylex from '@stylexjs/stylex';
import { queryOptionsStyles } from './QueryOptions.stylex';
import { useState } from 'react';

import { Trans, t } from '@grafana/i18n';
import { Icon, InlineField, RelativeTimeRangePicker, Toggletip, clearButtonStyles } from '@grafana/ui';
import { type AlertQuery } from 'app/types/unified-alerting-dto';

import { TimeRangeLabel } from '../TimeRangeLabel';

import { type AlertQueryOptions, MaxDataPointsOption, MinIntervalOption } from './QueryWrapper';

export interface QueryOptionsProps {
  query: AlertQuery;
  queryOptions: AlertQueryOptions;
  onChangeTimeRange?: (timeRange: RelativeTimeRange, index: number) => void;
  onChangeQueryOptions: (options: AlertQueryOptions, index: number) => void;
  index: number;
}

export const QueryOptions = ({
  query,
  queryOptions,
  onChangeTimeRange,
  onChangeQueryOptions,
  index,
}: QueryOptionsProps) => {

  const [showOptions, setShowOptions] = useState(false);

  const separator = <span>, </span>;

  return (
    <>
      <Toggletip
        content={
          <div {...stylex.props(queryOptionsStyles.queryOptions)}>
            {onChangeTimeRange && (
              <InlineField label={t('alerting.query-options.label-time-range', 'Time Range')}>
                <RelativeTimeRangePicker
                  timeRange={query.relativeTimeRange ?? getDefaultRelativeTimeRange()}
                  onChange={(range) => onChangeTimeRange(range, index)}
                />
              </InlineField>
            )}
            <MaxDataPointsOption options={queryOptions} onChange={(options) => onChangeQueryOptions(options, index)} />
            <MinIntervalOption options={queryOptions} onChange={(options) => onChangeQueryOptions(options, index)} />
          </div>
        }
        closeButton={true}
        placement="bottom-start"
      >
        <button type="button" {...stylex.props(queryOptionsStyles.actionLink)} onClick={() => setShowOptions(!showOptions)}>
          <Trans i18nKey="alerting.query-options.button-options">Options</Trans>{' '}
          {showOptions ? <Icon name="angle-right" /> : <Icon name="angle-down" />}
        </button>
      </Toggletip>

      <div {...stylex.props(queryOptionsStyles.staticValues)}>
        <span>
          <TimeRangeLabel relativeTimeRange={query.relativeTimeRange ?? getDefaultRelativeTimeRange()} />
        </span>

        {queryOptions.maxDataPoints && (
          <>
            {separator}
            <Trans
              i18nKey="alerting.query-options.max-data-points"
              values={{ maxDataPoints: queryOptions.maxDataPoints }}
            >
              MD = {'{{maxDataPoints}}'}
            </Trans>
          </>
        )}
        {queryOptions.minInterval && (
          <>
            {separator}
            <Trans i18nKey="alerting.query-options.min-interval" values={{ minInterval: queryOptions.minInterval }}>
              Min. Interval = {'{{minInterval}}'}
            </Trans>
          </>
        )}
      </div>
    </>
  );
};

