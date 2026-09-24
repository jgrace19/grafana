import { autoUpdate, useClick, useDismiss, useFloating, useInteractions } from '@floating-ui/react';
import * as stylex from '@stylexjs/stylex';
import { type ChangeEvent, forwardRef, useImperativeHandle, useState } from 'react';

import { dateTime } from '@grafana/data';

import { zIndex } from '../../../themes/stylex/constants.stylex';
import { mergeStylexProps } from '../../../themes/stylex/mergeStylexProps';
import { getPositioningMiddleware } from '../../../utils/floating';
import { type Props as InputProps, Input } from '../../Input/Input';
import { DatePicker } from '../DatePicker/DatePicker';

import './DatePickerWithInput.css';

export const formatDate = (date: Date | string) => dateTime(date).format('L');

/** @public */
export interface DatePickerWithInputProps extends Omit<InputProps, 'value' | 'onChange'> {
  /** Value selected by the DatePicker */
  value?: Date | string;
  /** The minimum date the value can be set to */
  minDate?: Date;
  /** The maximum date the value can be set to */
  maxDate?: Date;
  /** Handles changes when a new date is selected */
  onChange: (value: Date | string) => void;
  /** Hide the calendar when date is selected */
  closeOnSelect?: boolean;
  /** Text that appears when the input has no text */
  placeholder?: string;
}

/**
 * An input with a calendar view, used to select a date.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/date-time-pickers-datepickerwithinput--docs
 * @public
 */
export const DatePickerWithInput = forwardRef<HTMLInputElement, DatePickerWithInputProps>(
  ({ value, minDate, maxDate, onChange, closeOnSelect, placeholder = 'Date', ...rest }, ref) => {
    const [open, setOpen] = useState(false);
    const placement = 'bottom-start';

    // the order of middleware is important!
    // see https://floating-ui.com/docs/arrow#order
    const middleware = getPositioningMiddleware(placement);

    const { context, refs, floatingStyles } = useFloating<HTMLInputElement>({
      open,
      placement,
      onOpenChange: setOpen,
      middleware,
      whileElementsMounted: autoUpdate,
      strategy: 'fixed',
    });

    const click = useClick(context);
    const dismiss = useDismiss(context);
    const { getReferenceProps, getFloatingProps } = useInteractions([dismiss, click]);

    useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(ref, () => refs.domReference.current, [
      refs.domReference,
    ]);

    return (
      <div {...stylex.props(styles.container)}>
        <Input
          ref={refs.setReference}
          type="text"
          autoComplete={'off'}
          placeholder={placeholder}
          value={value ? formatDate(value) : value}
          onChange={(ev: ChangeEvent<HTMLInputElement>) => {
            // Allow resetting the date
            if (ev.target.value === '') {
              onChange('');
            }
          }}
          className="gf-date-picker-with-input"
          {...rest}
          {...getReferenceProps()}
        />
        <div
          {...mergeStylexProps(stylex.props(styles.popover), { style: floatingStyles })}
          ref={refs.setFloating}
          {...getFloatingProps()}
        >
          <DatePicker
            isOpen={open}
            value={value && typeof value !== 'string' ? value : dateTime().toDate()}
            minDate={minDate}
            maxDate={maxDate}
            onChange={(ev) => {
              onChange(ev);
              if (closeOnSelect) {
                setOpen(false);
              }
            }}
            onClose={() => setOpen(false)}
          />
        </div>
      </div>
    );
  }
);

DatePickerWithInput.displayName = 'DatePickerWithInput';

const styles = stylex.create({
  container: {
    position: 'relative',
  },
  popover: {
    zIndex: zIndex.tooltip,
  },
});
