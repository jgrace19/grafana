import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';

import { type RelativeTimeRange, getDefaultRelativeTimeRange } from '@grafana/data';
import { Trans, t } from '@grafana/i18n';
import { Icon, InlineField, RelativeTimeRangePicker, Toggletip } from '@grafana/ui';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';
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
          <div>
            {onChangeTimeRange && (
              <InlineField
                xstyle={styles.optionField}
                label={t('alerting.query-options.label-time-range', 'Time Range')}
              >
                <RelativeTimeRangePicker
                  timeRange={query.relativeTimeRange ?? getDefaultRelativeTimeRange()}
                  onChange={(range) => onChangeTimeRange(range, index)}
                />
              </InlineField>
            )}
            <MaxDataPointsOption
              xstyle={styles.optionField}
              options={queryOptions}
              onChange={(options) => onChangeQueryOptions(options, index)}
            />
            <MinIntervalOption
              xstyle={styles.optionField}
              options={queryOptions}
              onChange={(options) => onChangeQueryOptions(options, index)}
            />
          </div>
        }
        closeButton={true}
        placement="bottom-start"
      >
        <button type="button" {...stylex.props(styles.actionLink)} onClick={() => setShowOptions(!showOptions)}>
          <Trans i18nKey="alerting.query-options.button-options">Options</Trans>{' '}
          {showOptions ? <Icon name="angle-right" /> : <Icon name="angle-down" />}
        </button>
      </Toggletip>

      <div {...stylex.props(styles.staticValues)}>
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

const styles = stylex.create({
  optionField: {
    justifyContent: 'space-between',
  },
  staticValues: {
    color: colors['--gf-colors-text-secondary'],
    marginRight: spacing['--gf-spacing-x1'],
  },
  actionLink: {
    backgroundColor: 'transparent',
    color: colors['--gf-colors-text-link'],
    borderStyle: 'none',
    padding: 0,
    cursor: 'pointer',
    textDecorationLine: { default: null, ':hover': 'underline' },
  },
});
