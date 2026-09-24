import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { type GraphSeriesValue } from '@grafana/data';
import { t } from '@grafana/i18n';

import { colors, spacing, typography } from '../../themes/stylex/tokens.stylex';
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
    <div data-testid="SeriesTableRow" {...stylex.props(styles.seriesTableRow, isActive && styles.activeSeries)}>
      {color && (
        <div {...stylex.props(styles.seriesTableCell)}>
          <SeriesIcon color={color} xstyle={styles.icon} />
        </div>
      )}
      {label && <div {...stylex.props(styles.seriesTableCell, styles.label)}>{label}</div>}
      {value && <div {...stylex.props(styles.seriesTableCell, styles.value)}>{value}</div>}
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
        <div {...stylex.props(styles.timestamp)} aria-label={t('grafana-ui.viz-tooltip.timestamp', 'Timestamp')}>
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

const styles = stylex.create({
  icon: {
    marginRight: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
    verticalAlign: 'middle',
  },
  seriesTableRow: {
    display: 'table-row',
    fontSize: typography['--gf-typography-body-small-font-size'],
  },
  seriesTableCell: {
    display: 'table-cell',
  },
  label: {
    wordBreak: 'break-all',
  },
  value: {
    paddingLeft: `calc(${spacing['--gf-spacing-grid-size']} * 2)`,
    textAlign: 'right',
  },
  activeSeries: {
    fontWeight: typography['--gf-typography-font-weight-bold'],
    color: colors['--gf-colors-text-max-contrast'],
  },
  timestamp: {
    fontWeight: typography['--gf-typography-font-weight-bold'],
    fontSize: typography['--gf-typography-body-small-font-size'],
  },
});
