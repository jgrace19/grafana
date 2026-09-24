import * as stylex from '@stylexjs/stylex';
import { uniqueId } from 'lodash';

import { type SelectableValue } from '@grafana/data';

import { mergeStylexProps } from '../../../themes/stylex/mergeStylexProps';
import { spacing } from '../../../themes/stylex/tokens.stylex';

import { RadioButtonDot } from './RadioButtonDot';

export interface RadioButtonListProps<T> {
  /** A name of a radio group. Used to group multiple radio inputs into a single group */
  name: string;
  id?: string;
  /** An array of available options */
  options: Array<SelectableValue<T>>;
  value?: T;
  onChange?: (value: T) => void;
  /** Disables all elements in the list */
  disabled?: boolean;
  /** Disables subset of elements in the list. Compares values using the === operator */
  disabledOptions?: T[];
  className?: string;
}

/**
 * RadioButtonList is used to select a single value from multiple mutually exclusive options usually in a vertical manner.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/inputs-radiobuttonlist--docs
 */
export function RadioButtonList<T extends string | number | readonly string[]>({
  name,
  id,
  options,
  value,
  onChange,
  className,
  disabled,
  disabledOptions = [],
}: RadioButtonListProps<T>) {
  const internalId = id ?? uniqueId('radiogroup-list-');

  return (
    <div id={id} {...mergeStylexProps(stylex.props(styles.container), { className })} role="radiogroup">
      {options.map((option, index) => {
        const itemId = `${internalId}-${index}`;

        const isChecked = value && value === option.value;
        const isDisabled = disabled || disabledOptions.some((optionValue) => optionValue === option.value);

        const handleChange = () => onChange && option.value && onChange(option.value);

        return (
          <RadioButtonDot<T>
            key={index}
            id={itemId}
            name={name}
            label={option.label}
            description={option.description}
            checked={isChecked}
            value={option.value}
            disabled={isDisabled}
            onChange={handleChange}
          />
        );
      })}
    </div>
  );
}

const styles = stylex.create({
  container: {
    display: 'grid',
    gap: spacing['--gf-spacing-x1'],
  },
});
