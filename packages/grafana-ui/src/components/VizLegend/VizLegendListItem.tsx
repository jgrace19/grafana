import * as stylex from '@stylexjs/stylex';
import { useCallback } from 'react';
import * as React from 'react';

import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';

import { mergeStylexClassName } from '../../themes/stylex/mergeClassNames';

import { VizLegendSeriesIcon } from './VizLegendSeriesIcon';
import { VizLegendStatsList } from './VizLegendStatsList';
import { vizLegendListItemStyleProps, vizLegendListItemStyles } from './VizLegendListItem.stylex';
import { type VizLegendItem } from './types';

export interface Props<T> {
  item: VizLegendItem<T>;
  className?: string;
  onLabelClick?: (item: VizLegendItem<T>, event: React.MouseEvent<HTMLButtonElement>) => void;
  onLabelMouseOver?: (
    item: VizLegendItem,
    event: React.MouseEvent<HTMLButtonElement> | React.FocusEvent<HTMLButtonElement>
  ) => void;
  onLabelMouseOut?: (
    item: VizLegendItem,
    event: React.MouseEvent<HTMLButtonElement> | React.FocusEvent<HTMLButtonElement>
  ) => void;
  readonly?: boolean;
  allItemsSelected: boolean;
}

export const VizLegendListItem = <T = unknown,>({
  item,
  onLabelClick,
  onLabelMouseOver,
  onLabelMouseOut,
  className,
  readonly,
  allItemsSelected,
}: Props<T>) => {
  const onMouseOver = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FocusEvent<HTMLButtonElement>) => {
      onLabelMouseOver?.(item, event);
    },
    [item, onLabelMouseOver]
  );

  const onMouseOut = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FocusEvent<HTMLButtonElement>) => {
      onLabelMouseOut?.(item, event);
    },
    [item, onLabelMouseOut]
  );

  const onClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      onLabelClick?.(item, event);
    },
    [item, onLabelClick]
  );

  const getAriaLabel = () =>
    allItemsSelected
      ? t('grafana-ui.viz-legend.all-series-selected', 'All series selected')
      : t('grafana-ui.viz-legend.only-this-series-selected', 'Only {{label}} selected', { label: item.label });

  const wrapperProps = mergeStylexClassName(
    stylex.props(vizLegendListItemStyles.itemWrapper, item.disabled && vizLegendListItemStyles.itemDisabled),
    className
  );

  return (
    <div {...wrapperProps} data-testid={selectors.components.VizLegend.seriesName(item.label)}>
      <VizLegendSeriesIcon
        seriesName={item.fieldName ?? item.label}
        color={item.color}
        gradient={item.gradient}
        readonly={readonly}
        lineStyle={item.lineStyle}
      />
      <button
        disabled={readonly}
        type="button"
        aria-label={getAriaLabel()}
        onBlur={onMouseOut}
        onFocus={onMouseOver}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        onClick={onClick}
        {...vizLegendListItemStyleProps('label')}
      >
        {item.label}
      </button>
      {item.getDisplayValues && <VizLegendStatsList stats={item.getDisplayValues()} />}
    </div>
  );
};

VizLegendListItem.displayName = 'VizLegendListItem';
