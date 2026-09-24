import { memo } from 'react';
import Calendar from 'react-calendar';

import { useStyles2 } from '../../../themes/ThemeContext';
import { ClickOutsideWrapper } from '../../ClickOutsideWrapper/ClickOutsideWrapper';
import { Icon } from '../../Icon/Icon';
import { getBodyStyles } from '../TimeRangePicker/CalendarBody';
import { datePickerStyleProps } from './DatePicker.stylex';

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
      <div {...datePickerStyleProps('modal')} data-testid="date-picker">
        <Body {...props} />
      </div>
    </ClickOutsideWrapper>
  );
});

DatePicker.displayName = 'DatePicker';

const Body = memo<DatePickerProps>(({ value, minDate, maxDate, onChange }) => {
  const styles = useStyles2(getBodyStyles);

  return (
    <Calendar
      className={styles.body}
      tileClassName={styles.title}
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
