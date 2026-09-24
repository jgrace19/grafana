import * as stylex from '@stylexjs/stylex';
import { clsx } from 'clsx';
import * as React from 'react';

import { type FieldConfig, getMinMaxAndDelta, type Field, isDataFrameWithValue } from '@grafana/data';
import { t } from '@grafana/i18n';
import {
  BarAlignment,
  GraphDrawStyle,
  type GraphFieldConfig,
  GraphGradientMode,
  LineInterpolation,
  type TableSparklineCellOptions,
  TableCellDisplayMode,
  VisibilityMode,
} from '@grafana/schema';

import { spacing } from '../../../../themes/stylex/tokens.stylex';
import { measureText } from '../../../../utils/measureText';
import { FormattedValueDisplay } from '../../../FormattedValueDisplay/FormattedValueDisplay';
import { Sparkline } from '../../../Sparkline/Sparkline';
import { MaybeWrapWithLink } from '../components/MaybeWrapWithLink';
import { type SparklineCellProps, type TableCellStyles } from '../types';
import { getAlignmentFactor, getCellOptions, prepareSparklineValue } from '../utils';

export const defaultSparklineCellConfig: TableSparklineCellOptions = {
  type: TableCellDisplayMode.Sparkline,
  drawStyle: GraphDrawStyle.Line,
  lineInterpolation: LineInterpolation.Smooth,
  lineWidth: 1,
  fillOpacity: 17,
  gradientMode: GraphGradientMode.Hue,
  pointSize: 2,
  barAlignment: BarAlignment.Center,
  showPoints: VisibilityMode.Never,
  hideValue: false,
};

export const SparklineCell = (props: SparklineCellProps) => {
  const { field, value, theme, timeRange, rowIdx, width } = props;
  const sparkline = prepareSparklineValue(value, field);

  if (!sparkline) {
    return (
      <MaybeWrapWithLink field={field} rowIdx={rowIdx}>
        {field.config.noValue || t('grafana-ui.table.sparkline.no-data', 'no data')}
      </MaybeWrapWithLink>
    );
  }

  // Get the step from the first two values to null-fill the x-axis based on timerange
  if (sparkline.x && !sparkline.x.config.interval && sparkline.x.values.length > 1) {
    sparkline.x.config.interval = sparkline.x.values[1] - sparkline.x.values[0];
  }

  // Remove non-finite values, e.g: NaN, +/-Infinity
  sparkline.y.values = sparkline.y.values.map((v) => {
    if (!Number.isFinite(v)) {
      return null;
    } else {
      return v;
    }
  });

  const range = getMinMaxAndDelta(sparkline.y);
  sparkline.y.config.min = range.min;
  sparkline.y.config.max = range.max;
  sparkline.y.state = { range };
  sparkline.timeRange = timeRange;

  const cellOptions = getTableSparklineCellOptions(field);

  const config: FieldConfig<GraphFieldConfig> = {
    color: field.config.color,
    custom: {
      ...defaultSparklineCellConfig,
      ...cellOptions,
    },
  };

  const hideValue = cellOptions.hideValue;
  let valueWidth = 0;
  let valueElement: React.ReactNode = null;
  if (!hideValue) {
    const newValue = isDataFrameWithValue(value) ? value.value : null;
    const displayValue = field.display!(newValue);
    const alignmentFactor = getAlignmentFactor(field, displayValue, rowIdx!);

    valueWidth =
      measureText(`${alignmentFactor.prefix ?? ''}${alignmentFactor.text}${alignmentFactor.suffix ?? ''}`, 16).width +
      theme.spacing.gridSize;

    valueElement = <FormattedValueDisplay style={{ width: valueWidth }} value={displayValue} />;
  }

  return (
    <MaybeWrapWithLink field={field} rowIdx={rowIdx}>
      {valueElement}
      <Sparkline width={width - valueWidth} height={25} sparkline={sparkline} config={config} theme={theme} />
    </MaybeWrapWithLink>
  );
};

function getTableSparklineCellOptions(field: Field): TableSparklineCellOptions {
  let options = getCellOptions(field);
  if (options.type === TableCellDisplayMode.Auto) {
    options = { ...options, type: TableCellDisplayMode.Sparkline };
  }
  if (options.type === TableCellDisplayMode.Sparkline) {
    return options;
  }
  throw new Error(`Expected options type ${TableCellDisplayMode.Sparkline} but got ${options.type}`);
}

// The same layout for the link that may wrap the value and chart is in TableNG.css.
export const getStyles: TableCellStyles = (_theme, { textAlign }) => ({
  xstyle: [styles.sparkline, textAlign === 'right' && styles.reverse],
  className: clsx('gf-table-ng-sparkline', textAlign === 'right' && 'gf-table-ng-sparkline-reverse'),
});

const styles = stylex.create({
  sparkline: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing['--gf-spacing-x1'],
  },
  reverse: {
    flexDirection: 'row-reverse',
  },
});
