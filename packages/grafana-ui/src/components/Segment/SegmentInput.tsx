import { type HTMLProps, useRef, useState } from 'react';
import * as React from 'react';
import { useClickAway } from 'react-use';

import { InlineLabel } from '../Forms/InlineLabel';

import { segmentStyles } from './styles';
import { type SegmentProps } from './types';
import { useExpandableLabel } from './useExpandableLabel';

export interface SegmentInputProps
  extends Omit<SegmentProps, 'allowCustomValue' | 'allowEmptyValue'>,
    Omit<HTMLProps<HTMLInputElement>, 'value' | 'onChange'> {
  value: string | number;
  onChange: (text: string | number) => void;
}

/**
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/inputs-segmentinput--docs
 */
export function SegmentInput({
  value: initialValue,
  onChange,
  Component,
  className,
  placeholder,
  inputPlaceholder,
  disabled,
  autofocus = false,
  onExpandedChange,
  ...rest
}: React.PropsWithChildren<SegmentInputProps>) {
  const ref = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState<number | string>(initialValue);
  const [Label, , expanded, setExpanded] = useExpandableLabel(autofocus, onExpandedChange);

  useClickAway(ref, () => {
    setExpanded(false);
    onChange(value);
  });

  if (!expanded) {
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
              {initialValue || placeholder}
            </InlineLabel>
          )
        }
      />
    );
  }

  return (
    <input
      {...rest}
      ref={ref}
      // this needs to autofocus, but it's ok as it's only rendered by choice
      // eslint-disable-next-line jsx-a11y/no-autofocus
      autoFocus
      className="gf-form gf-form-input"
      value={value}
      placeholder={inputPlaceholder}
      onChange={(item) => {
        setValue(item.target.value);
      }}
      onBlur={() => {
        setExpanded(false);
        onChange(value);
      }}
      onKeyDown={(e) => {
        if ([13, 27].includes(e.keyCode)) {
          setExpanded(false);
          onChange(value);
        }
      }}
    />
  );
}
