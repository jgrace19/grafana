import clsx from 'clsx';

import { seriesTableStyleProps } from './SeriesTable.stylex'

import * as React from 'react';

import { type GraphSeriesValue } from '@grafana/data';
import { t } from '@grafana/i18n';

import { SeriesIcon } from '../VizLegend/SeriesIcon';

/**
 * @public
 */
export interface SeriesTableRowProps {
  color?: string;
  label?: React.ReactNode;
  value?: string | GraphSeriesValue;
  isActive?: boolean;
}

/**
 * @public
 */
export const SeriesTableRow = ({ color, label, value, isActive }: SeriesTableRowProps) => {

  return (
    <div data-testid="SeriesTableRow" className={clsx(seriesTableStyleProps('seriesTableRow'), isActive && seriesTableStyleProps('activeSeries'))}>
      {color && (
        <div {...seriesTableStyleProps('seriesTableCell')}>
          <SeriesIcon color={color} {...seriesTableStyleProps('icon')} />
        </div>
      )}
      {label && <div className={clsx(seriesTableStyleProps('seriesTableCell'), seriesTableStyleProps('label'))}>{label}</div>}
      {value && <div className={clsx(seriesTableStyleProps('seriesTableCell'), seriesTableStyleProps('value'))}>{value}</div>}
    </div>
  );
};

/**
 * @public
 */
export interface SeriesTableProps {
  timestamp?: string | GraphSeriesValue;
  series: SeriesTableRowProps[];
}

/**
 * @public
 */
export const SeriesTable = ({ timestamp, series }: SeriesTableProps) => {

  return (
    <>
      {timestamp && (
        <div {...seriesTableStyleProps('timestamp')} aria-label={t('grafana-ui.viz-tooltip.timestamp', 'Timestamp')}>
          {timestamp}
        </div>
      )}
      {series.map((s, i) => {
        return (
          <SeriesTableRow
            isActive={s.isActive}
            label={s.label}
            color={s.color}
            value={s.value}
            key={`${s.label}-${i}`}
          />
        );
      })}
    </>
  );
};
