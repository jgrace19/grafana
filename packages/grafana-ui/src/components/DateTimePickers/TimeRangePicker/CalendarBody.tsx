import * as stylex from '@stylexjs/stylex';
import { clsx } from 'clsx';
import { useCallback } from 'react';
import Calendar, { type CalendarType } from 'react-calendar';

import { dateTimeParse, type DateTime, type TimeZone } from '@grafana/data';
import { t } from '@grafana/i18n';

import { zIndex } from '../../../themes/stylex/constants.stylex';
import { colors } from '../../../themes/stylex/tokens.stylex';
import { Icon } from '../../Icon/Icon';
import { getWeekStart, type WeekStart } from '../WeekStartPicker';
import { adjustDateForReactCalendar } from '../utils/adjustDateForReactCalendar';

import { type TimePickerCalendarProps } from './TimePickerCalendar';

import './CalendarBody.global.css';

const weekStartMap: Record<WeekStart, CalendarType> = {
  saturday: 'islamic',
  sunday: 'gregory',
  monday: 'iso8601',
};

export function Body({ onChange, from, to, timeZone, weekStart }: TimePickerCalendarProps) {
  const value = inputToValue(from, to, new Date(), timeZone);
  const onCalendarChange = useOnCalendarChange(onChange, timeZone);
  const weekStartValue = getWeekStart(weekStart);

  return (
    <Calendar
      selectRange={true}
      next2Label={null}
      prev2Label={null}
      className={calendarClassNames.body}
      tileClassName={calendarClassNames.tile}
      value={value}
      nextLabel={<Icon name="angle-right" />}
      nextAriaLabel={t('time-picker.calendar.next-month', 'Next month')}
      prevLabel={<Icon name="angle-left" />}
      prevAriaLabel={t('time-picker.calendar.previous-month', 'Previous month')}
      onChange={onCalendarChange}
      locale="en"
      calendarType={weekStartMap[weekStartValue]}
    />
  );
}

Body.displayName = 'Body';

export function inputToValue(
  from: DateTime,
  to: DateTime,
  invalidDateDefault: Date = new Date(),
  timezone?: string
): [Date, Date] {
  let fromAsDate = from.isValid() ? from.toDate() : invalidDateDefault;
  let toAsDate = to.isValid() ? to.toDate() : invalidDateDefault;

  if (timezone) {
    fromAsDate = adjustDateForReactCalendar(fromAsDate, timezone);
    toAsDate = adjustDateForReactCalendar(toAsDate, timezone);
  }

  if (fromAsDate > toAsDate) {
    return [toAsDate, fromAsDate];
  }

  return [fromAsDate, toAsDate];
}

function useOnCalendarChange(onChange: (from: DateTime, to: DateTime) => void, timeZone?: TimeZone) {
  return useCallback<NonNullable<React.ComponentProps<typeof Calendar>['onChange']>>(
    (value) => {
      if (!Array.isArray(value)) {
        return console.error('onCalendarChange: should be run in selectRange={true}');
      }

      if (value[0] && value[1]) {
        const from = dateTimeParse(dateInfo(value[0]), { timeZone });
        const to = dateTimeParse(dateInfo(value[1]), { timeZone });

        onChange(from, to);
      }
    },
    [onChange, timeZone]
  );
}

function dateInfo(date: Date): number[] {
  return [date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()];
}

const styles = stylex.create({
  body: {
    zIndex: zIndex.modal,
    backgroundColor: colors['--gf-colors-background-elevated'],
    width: '268px',
  },
});

/** Class names for a react-calendar `Calendar`; its DOM is styled by CalendarBody.global.css. */
export const calendarClassNames = {
  body: clsx(stylex.props(styles.body).className, 'gf-calendar'),
  tile: 'gf-calendar-tile',
};
