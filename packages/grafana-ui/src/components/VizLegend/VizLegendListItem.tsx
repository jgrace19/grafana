import * as stylex from '@stylexjs/stylex';
import { useCallback } from 'react';
import * as React from 'react';

import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';

import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { colors, spacing } from '../../themes/stylex/tokens.stylex';

import { VizLegendSeriesIcon } from './VizLegendSeriesIcon';
import { VizLegendStatsList } from './VizLegendStatsList';
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

/**
 * @internal
 */
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
      if (onLabelMouseOver) {
        onLabelMouseOver(item, event);
      }
    },
    [item, onLabelMouseOver]
  );

  const onMouseOut = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FocusEvent<HTMLButtonElement>) => {
      if (onLabelMouseOut) {
        onLabelMouseOut(item, event);
      }
    },
    [item, onLabelMouseOut]
  );

  const onClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (onLabelClick) {
        onLabelClick(item, event);
      }
    },
    [item, onLabelClick]
  );

  const getAriaLabel = () => {
    if (allItemsSelected) {
      return t('grafana-ui.viz-legend.all-series-selected', 'All series selected');
    }
    return t('grafana-ui.viz-legend.only-this-series-selected', 'Only {{label}} selected', { label: item.label });
  };

  return (
    <div
      {...mergeStylexProps(stylex.props(styles.itemWrapper, item.disabled && styles.itemDisabled), { className })}
      data-testid={selectors.components.VizLegend.seriesName(item.label)}
    >
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
        {...stylex.props(styles.label)}
      >
        {item.label}
      </button>

      {item.getDisplayValues && <VizLegendStatsList stats={item.getDisplayValues()} />}
    </div>
  );
};

VizLegendListItem.displayName = 'VizLegendListItem';

const styles = stylex.create({
  label: {
    whiteSpace: 'nowrap',
    backgroundColor: 'transparent',
    backgroundImage: 'none',
    borderStyle: 'none',
    fontSize: 'inherit',
    padding: 0,
    userSelect: 'text',
  },
  itemDisabled: {
    color: colors['--gf-colors-text-disabled'],
  },
  itemWrapper: {
    display: 'flex',
    whiteSpace: 'nowrap',
    alignItems: 'center',
    gap: spacing['--gf-spacing-x1'],
    flexGrow: 1,
  },
});
