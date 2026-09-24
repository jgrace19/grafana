import { autoUpdate, useFloating } from '@floating-ui/react';
import { useDialog } from '@react-aria/dialog';
import { FocusScope } from '@react-aria/focus';
import { useOverlay } from '@react-aria/overlays';
import * as stylex from '@stylexjs/stylex';
import { type FormEvent, type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import * as React from 'react';
import Calendar from 'react-calendar';
import { useMedia } from 'react-use';

import {
  dateTimeFormat,
  type DateTime,
  dateTime,
  isDateTime,
  dateTimeForTimeZone,
  getTimeZone,
  type TimeZone,
} from '@grafana/data';
import { Components } from '@grafana/e2e-selectors';
import { t, Trans } from '@grafana/i18n';

import { useTheme2 } from '../../../themes/ThemeContext';
import { zIndex } from '../../../themes/stylex/constants.stylex';
import { mergeStylexProps } from '../../../themes/stylex/mergeStylexProps';
import { colors, components, shape, spacing } from '../../../themes/stylex/tokens.stylex';
import { getPositioningMiddleware } from '../../../utils/floating';
import { Button } from '../../Button/Button';
import { InlineField } from '../../Forms/InlineField';
import { Icon } from '../../Icon/Icon';
import { Input } from '../../Input/Input';
import { Stack } from '../../Layout/Stack/Stack';
import { Portal } from '../../Portal/Portal';
import { TimeOfDayPicker, POPUP_CLASS_NAME } from '../TimeOfDayPicker';
import { calendarClassNames } from '../TimeRangePicker/CalendarBody';
import { isValid } from '../utils';
import { adjustDateForReactCalendar } from '../utils/adjustDateForReactCalendar';

import './DateTimePicker.css';

export interface Props {
  /** Input date for the component */
  date?: DateTime;
  /** Callback for returning the selected date */
  onChange: (date?: DateTime) => void;
  /** label for the input field */
  label?: ReactNode;
  /** Set the latest selectable date */
  maxDate?: Date;
  /** Set the minimum selectable date */
  minDate?: Date;
  /** Display seconds on the time picker */
  showSeconds?: boolean;
  /** Set the hours that can't be selected */
  disabledHours?: () => number[];
  /** Set the minutes that can't be selected */
  disabledMinutes?: () => number[];
  /** Set the seconds that can't be selected */
  disabledSeconds?: () => number[];
  /** Can input be cleared/have empty values */
  clearable?: boolean;
  /** Custom timezone for the date/time display */
  timeZone?: TimeZone;
}

/**
 * A component for selecting a date *and* time.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/date-time-pickers-datetimepicker--docs
 */
export const DateTimePicker = ({
  date,
  maxDate,
  minDate,
  label,
  onChange,
  disabledHours,
  disabledMinutes,
  disabledSeconds,
  timeZone,
  showSeconds = true,
  clearable = false,
}: Props) => {
  const [isOpen, setOpen] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const { overlayProps, underlayProps } = useOverlay(
    {
      onClose: () => setOpen(false),
      isDismissable: true,
      isOpen,
      shouldCloseOnInteractOutside: (element) => {
        const popupElement = document.getElementsByClassName(POPUP_CLASS_NAME)[0];
        return !(popupElement && popupElement.contains(element));
      },
    },
    ref
  );
  const { dialogProps } = useDialog({}, ref);

  const theme = useTheme2();
  const isFullscreen = useMedia(`(min-width: ${theme.breakpoints.values.lg}px)`);
  const placement = 'bottom-start';

  // the order of middleware is important!
  // see https://floating-ui.com/docs/arrow#order
  const middleware = getPositioningMiddleware(placement);

  const { refs, floatingStyles } = useFloating({
    open: isOpen,
    placement,
    onOpenChange: setOpen,
    middleware,
    whileElementsMounted: autoUpdate,
    strategy: 'fixed',
  });

  const onApply = useCallback(
    (date: DateTime) => {
      setOpen(false);
      onChange(date);
    },
    [onChange]
  );

  const onOpen = useCallback(
    (event: FormEvent<HTMLElement>) => {
      event.preventDefault();
      setOpen(true);
    },
    [setOpen]
  );

  return (
    <div data-testid="date-time-picker" style={{ position: 'relative' }}>
      <DateTimeInput
        date={date}
        onChange={onChange}
        isFullscreen={isFullscreen}
        onOpen={onOpen}
        label={label}
        ref={refs.setReference}
        showSeconds={showSeconds}
        clearable={clearable}
        timeZone={timeZone}
      />
      {isOpen ? (
        isFullscreen ? (
          <Portal>
            <FocusScope contain autoFocus restoreFocus>
              <div ref={ref} {...overlayProps} {...dialogProps}>
                <DateTimeCalendar
                  date={date}
                  onChange={onApply}
                  isFullscreen={true}
                  onClose={() => setOpen(false)}
                  maxDate={maxDate}
                  minDate={minDate}
                  ref={refs.setFloating}
                  style={floatingStyles}
                  showSeconds={showSeconds}
                  disabledHours={disabledHours}
                  disabledMinutes={disabledMinutes}
                  disabledSeconds={disabledSeconds}
                  timeZone={timeZone}
                />
              </div>
            </FocusScope>
          </Portal>
        ) : (
          <Portal>
            <div {...stylex.props(styles.modalBackdrop)} {...underlayProps} />
            <FocusScope contain autoFocus restoreFocus>
              <div ref={ref} {...overlayProps} {...dialogProps}>
                <div {...stylex.props(styles.modal)}>
                  <DateTimeCalendar
                    date={date}
                    maxDate={maxDate}
                    minDate={minDate}
                    onChange={onApply}
                    isFullscreen={false}
                    onClose={() => setOpen(false)}
                    showSeconds={showSeconds}
                    disabledHours={disabledHours}
                    disabledMinutes={disabledMinutes}
                    disabledSeconds={disabledSeconds}
                    timeZone={timeZone}
                  />
                </div>
              </div>
            </FocusScope>
          </Portal>
        )
      ) : null}
    </div>
  );
};

interface DateTimeCalendarProps extends Omit<Props, 'label' | 'clearable' | 'onChange'> {
  onChange: (date: DateTime) => void;
  onClose: () => void;
  isFullscreen: boolean;
  style?: React.CSSProperties;
}

type InputProps = Pick<Props, 'onChange' | 'label' | 'date' | 'showSeconds' | 'clearable' | 'timeZone'> & {
  isFullscreen: boolean;
  onOpen: (event: FormEvent<HTMLElement>) => void;
};

type InputState = {
  value: string;
  invalid: boolean;
};

const DateTimeInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ date, label, onChange, onOpen, timeZone, showSeconds = true, clearable = false }, ref) => {
    const format = showSeconds ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD HH:mm';
    const [internalDate, setInternalDate] = useState<InputState>(() => {
      return {
        value: date ? dateTimeFormat(date, { timeZone }) : !clearable ? dateTimeFormat(dateTime(), { timeZone }) : '',
        invalid: false,
      };
    });

    useEffect(() => {
      if (date) {
        const formattedDate = dateTimeFormat(date, { format, timeZone });
        setInternalDate({
          invalid: !isValid(formattedDate),
          value: isDateTime(date) ? formattedDate : date,
        });
      }
    }, [date, format, timeZone]);

    const onChangeDate = useCallback((event: FormEvent<HTMLInputElement>) => {
      const isInvalid = !isValid(event.currentTarget.value);
      setInternalDate({
        value: event.currentTarget.value,
        invalid: isInvalid,
      });
    }, []);

    const onBlur = useCallback(() => {
      if (!internalDate.invalid && internalDate.value) {
        const date = dateTimeForTimeZone(getTimeZone({ timeZone }), internalDate.value);
        onChange(date);
      }
    }, [internalDate, onChange, timeZone]);

    const clearInternalDate = useCallback(() => {
      setInternalDate({ value: '', invalid: false });
      onChange();
    }, [onChange]);

    const icon = (
      <Button
        aria-label={t('grafana-ui.date-time-picker.calendar-icon-label', 'Time picker')}
        icon="calendar-alt"
        variant="secondary"
        onClick={onOpen}
      />
    );
    return (
      <InlineField
        label={label}
        invalid={!!(internalDate.value && internalDate.invalid)}
        className="gf-date-time-picker-field"
      >
        <Input
          onChange={onChangeDate}
          addonAfter={icon}
          value={internalDate.value}
          onBlur={onBlur}
          data-testid={Components.DateTimePicker.input}
          placeholder={t('grafana-ui.date-time-picker.select-placeholder', 'Select date/time')}
          ref={ref}
          suffix={
            clearable &&
            internalDate.value && <Icon name="times" xstyle={styles.clearIcon} onClick={clearInternalDate} />
          }
        />
      </InlineField>
    );
  }
);

DateTimeInput.displayName = 'DateTimeInput';

const DateTimeCalendar = React.forwardRef<HTMLDivElement, DateTimeCalendarProps>(
  (
    {
      date,
      onClose,
      onChange,
      isFullscreen,
      maxDate,
      minDate,
      style,
      showSeconds = true,
      disabledHours,
      disabledMinutes,
      disabledSeconds,
      timeZone,
    },
    ref
  ) => {
    // need to keep these 2 separate in state since react-calendar doesn't support different timezones
    const [timeOfDayDateTime, setTimeOfDayDateTime] = useState(() => {
      if (date && date.isValid()) {
        return dateTimeForTimeZone(getTimeZone({ timeZone }), date);
      }

      return dateTimeForTimeZone(getTimeZone({ timeZone }), new Date());
    });
    const [reactCalendarDate, setReactCalendarDate] = useState<Date>(() => {
      if (date && date.isValid()) {
        return adjustDateForReactCalendar(date.toDate(), getTimeZone({ timeZone }));
      }

      return adjustDateForReactCalendar(new Date(), getTimeZone({ timeZone }));
    });

    const onChangeDate = useCallback<NonNullable<React.ComponentProps<typeof Calendar>['onChange']>>((date) => {
      if (date && !Array.isArray(date)) {
        setReactCalendarDate(date);
      }
    }, []);

    const onChangeTime = useCallback((date: DateTime) => {
      setTimeOfDayDateTime(date);
    }, []);

    // here we need to stitch the 2 date objects back together
    const handleApply = () => {
      // we take the date that's set by TimeOfDayPicker
      const newDate = dateTime(timeOfDayDateTime);

      // and apply the date/month/year set by react-calendar
      newDate.set('date', reactCalendarDate.getDate());
      newDate.set('month', reactCalendarDate.getMonth());
      newDate.set('year', reactCalendarDate.getFullYear());

      onChange(newDate);
    };

    return (
      <div
        {...mergeStylexProps(stylex.props(styles.container, isFullscreen && styles.fullScreen), { style })}
        ref={ref}
      >
        <Calendar
          next2Label={null}
          prev2Label={null}
          value={reactCalendarDate}
          nextLabel={<Icon name="angle-right" />}
          nextAriaLabel={t('grafana-ui.date-time-picker.next-label', 'Next month')}
          prevLabel={<Icon name="angle-left" />}
          prevAriaLabel={t('grafana-ui.date-time-picker.previous-label', 'Previous month')}
          onChange={onChangeDate}
          locale="en"
          className={calendarClassNames.body}
          tileClassName={calendarClassNames.tile}
          maxDate={maxDate}
          minDate={minDate}
        />
        <div {...stylex.props(styles.time)}>
          <TimeOfDayPicker
            showSeconds={showSeconds}
            onChange={onChangeTime}
            value={timeOfDayDateTime}
            disabledHours={disabledHours}
            disabledMinutes={disabledMinutes}
            disabledSeconds={disabledSeconds}
          />
        </div>
        <Stack>
          <Button type="button" onClick={handleApply}>
            <Trans i18nKey="grafana-ui.date-time-picker.apply">Apply</Trans>
          </Button>
          <Button variant="secondary" type="button" onClick={onClose}>
            <Trans i18nKey="grafana-ui.date-time-picker.cancel">Cancel</Trans>
          </Button>
        </Stack>
      </div>
    );
  }
);

DateTimeCalendar.displayName = 'DateTimeCalendar';

const styles = stylex.create({
  container: {
    padding: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-weak'],
    borderRadius: shape['--gf-shape-radius-default'],
    backgroundColor: colors['--gf-colors-background-primary'],
    zIndex: zIndex.modal,
  },
  fullScreen: {
    position: 'absolute',
  },
  time: {
    marginBottom: `calc(${spacing['--gf-spacing-grid-size']} * 2)`,
  },
  modal: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: zIndex.modal,
    maxWidth: '280px',
  },
  modalBackdrop: {
    position: 'fixed',
    zIndex: zIndex.modalBackdrop,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: components['--gf-components-overlay-background'],
  },
  clearIcon: {
    cursor: 'pointer',
  },
});
