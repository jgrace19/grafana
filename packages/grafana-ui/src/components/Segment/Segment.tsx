import { type HTMLProps } from 'react';
import * as React from 'react';

import { type SelectableValue } from '@grafana/data';

import { InlineLabel } from '../Forms/InlineLabel';
import { getLabelFromValue } from '../Select/utils';

import { SegmentSelect } from './SegmentSelect';
import { segmentStyles } from './styles';
import { type SegmentProps } from './types';
import { useExpandableLabel } from './useExpandableLabel';

export interface SegmentSyncProps<T> extends SegmentProps, Omit<HTMLProps<HTMLDivElement>, 'value' | 'onChange'> {
  value?: T | SelectableValue<T>;
  onChange: (item: SelectableValue<T>) => void;
  options: Array<SelectableValue<T>>;
  inputMinWidth?: number;
}

/**
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/inputs-segment--docs
 */
export function Segment<T>({
  options,
  value,
  onChange,
  Component,
  className,
  allowCustomValue,
  allowEmptyValue,
  placeholder,
  disabled,
  inputMinWidth,
  inputPlaceholder,
  onExpandedChange,
  autofocus = false,
  ...rest
}: React.PropsWithChildren<SegmentSyncProps<T>>) {
  const [Label, labelWidth, expanded, setExpanded] = useExpandableLabel(autofocus, onExpandedChange);
  const width = inputMinWidth ? Math.max(inputMinWidth, labelWidth) : labelWidth;

  if (!expanded) {
    const label = getLabelFromValue(value);

    return (
      <Label
        disabled={disabled}
        Component={
          Component || (
            <InlineLabel
              width="auto"
              className={className}
              xstyle={[
                segmentStyles.segment,
                disabled && segmentStyles.disabled,
                placeholder !== undefined && !value && segmentStyles.placeholder,
              ]}
            >
              {label || placeholder}
            </InlineLabel>
          )
        }
      />
    );
  }

  return (
    <SegmentSelect
      {...rest}
      value={value && typeof value !== 'object' ? { value } : value}
      placeholder={inputPlaceholder}
      options={options}
      width={width}
      onClickOutside={() => setExpanded(false)}
      allowCustomValue={allowCustomValue}
      allowEmptyValue={allowEmptyValue}
      onChange={(item) => {
        setExpanded(false);
        onChange(item);
      }}
    />
  );
}
