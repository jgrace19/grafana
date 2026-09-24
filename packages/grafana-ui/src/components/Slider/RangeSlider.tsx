import Slider, { type SliderProps } from '@rc-component/slider';
import * as stylex from '@stylexjs/stylex';
import { useCallback } from 'react';

import { t } from '@grafana/i18n';

import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { spacing } from '../../themes/stylex/tokens.stylex';

import HandleTooltip from './HandleTooltip';
import { type RangeSliderProps } from './types';

import '@rc-component/slider/assets/index.css';
import './Slider.css';

/**
 * @public
 *
 * RichHistoryQueriesTab uses this Range Component
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/inputs-rangeslider--docs
 */
export const RangeSlider = ({
  min,
  max,
  onChange,
  onAfterChange,
  orientation = 'horizontal',
  reverse,
  step,
  formatTooltipResult,
  value,
  tooltipAlwaysVisible = true,
}: RangeSliderProps) => {
  const handleChange = useCallback(
    (v: number | number[]) => {
      const value = typeof v === 'number' ? [v, v] : v;
      onChange?.(value);
    },
    [onChange]
  );

  const handleChangeComplete = useCallback(
    (v: number | number[]) => {
      const value = typeof v === 'number' ? [v, v] : v;
      onAfterChange?.(value);
    },
    [onAfterChange]
  );

  const isHorizontal = orientation === 'horizontal';
  const dragHandleAriaLabel = t('grafana-ui.range-slider.drag-handle-aria-label', 'Use arrow keys to change the value');

  const tipHandleRender: SliderProps['handleRender'] = (node, handleProps) => {
    return (
      <HandleTooltip
        value={handleProps.value}
        visible={tooltipAlwaysVisible || handleProps.dragging}
        tipFormatter={formatTooltipResult ? () => formatTooltipResult(handleProps.value) : undefined}
        placement={isHorizontal ? 'top' : 'right'}
      >
        {node}
      </HandleTooltip>
    );
  };

  return (
    <div
      {...mergeStylexProps(
        stylex.props(styles.container, isHorizontal ? styles.containerHorizontal : styles.containerVertical),
        { className: 'gf-slider' }
      )}
    >
      <Slider
        min={min}
        max={max}
        step={step}
        defaultValue={value}
        range={true}
        onChange={handleChange}
        onChangeComplete={handleChangeComplete}
        vertical={!isHorizontal}
        reverse={reverse}
        handleRender={tipHandleRender}
        ariaLabelForHandle={dragHandleAriaLabel}
      />
    </div>
  );
};

RangeSlider.displayName = 'RangeSlider';

const styles = stylex.create({
  container: {
    width: '100%',
  },
  containerHorizontal: {
    margin: 'inherit',
    paddingBottom: 'inherit',
    height: 'auto',
  },
  containerVertical: {
    marginTop: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
    marginRight: `calc(${spacing['--gf-spacing-grid-size']} * 3)`,
    marginBottom: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
    marginLeft: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
    paddingBottom: 'inherit',
    height: '100%',
  },
});
