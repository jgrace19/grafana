import * as stylex from '@stylexjs/stylex';
import { clsx } from 'clsx';
import { memo } from 'react';
import Calendar from 'react-calendar';

import { zIndex } from '../../../themes/stylex/constants.stylex';
import { colors, shadows, shape } from '../../../themes/stylex/tokens.stylex';
import { ClickOutsideWrapper } from '../../ClickOutsideWrapper/ClickOutsideWrapper';
import { Icon } from '../../Icon/Icon';
import { calendarClassNames } from '../TimeRangePicker/CalendarBody';

import './DatePicker.global.css';

/** @public */
export interface DatePickerProps {
  isOpen?: boolean;
  onClose: () => void;
  onChange: (value: Date) => void;
  value?: Date;
  minDate?: Date;
  maxDate?: Date;
}

/**
 * A component with a calendar view for selecting a date.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/date-time-pickers-datepicker--docs
 * @public
 * */
export const DatePicker = memo<DatePickerProps>((props) => {
  const { isOpen, onClose } = props;

  if (!isOpen) {
    return null;
  }

  return (
    <ClickOutsideWrapper useCapture={true} includeButtonPress={false} onClick={onClose}>
      <div className={clsx(stylex.props(styles.modal).className, 'gf-date-picker')} data-testid="date-picker">
        <Body {...props} />
      </div>
    </ClickOutsideWrapper>
  );
});

DatePicker.displayName = 'DatePicker';

const Body = memo<DatePickerProps>(({ value, minDate, maxDate, onChange }) => {
  return (
    <Calendar
      className={calendarClassNames.body}
      tileClassName={calendarClassNames.tile}
      value={value || new Date()}
      minDate={minDate}
      maxDate={maxDate}
      nextLabel={<Icon name="angle-right" />}
      prevLabel={<Icon name="angle-left" />}
      onChange={(ev) => {
        if (ev && !Array.isArray(ev)) {
          onChange(ev);
        }
      }}
      locale="en"
    />
  );
});

Body.displayName = 'Body';

const styles = stylex.create({
  modal: {
    zIndex: zIndex.modal,
    boxShadow: shadows['--gf-shadows-z3'],
    backgroundColor: colors['--gf-colors-background-primary'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-weak'],
    borderTopLeftRadius: shape['--gf-shape-radius-default'],
    borderBottomLeftRadius: shape['--gf-shape-radius-default'],
  },
});
