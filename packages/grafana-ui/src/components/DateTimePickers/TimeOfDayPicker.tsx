import RcPicker, { type PickerProps } from '@rc-component/picker';
import generateConfig from '@rc-component/picker/lib/generate/moment';
import locale from '@rc-component/picker/lib/locale/en_US';
import * as stylex from '@stylexjs/stylex';
import { clsx } from 'clsx';
import { type Moment } from 'moment';

import { dateTime, type DateTime, dateTimeAsMoment, isDateTimeInput } from '@grafana/data';

import { colors } from '../../themes/stylex/tokens.stylex';
import { type FormInputSize } from '../Forms/types';
import { Icon } from '../Icon/Icon';
import '@rc-component/picker/assets/index.css';
import './TimeOfDayPicker.css';

interface BaseProps {
  onChange: (value: DateTime) => void | ((value?: DateTime) => void);
  value?: DateTime;
  showHour?: boolean;
  showSeconds?: boolean;
  minuteStep?: PickerProps['minuteStep'];
  size?: FormInputSize;
  disabled?: boolean;
  disabledHours?: () => number[];
  disabledMinutes?: () => number[];
  disabledSeconds?: () => number[];
  placeholder?: string;
  allowEmpty?: boolean;
  id?: string;
}

interface AllowEmptyProps extends BaseProps {
  allowEmpty: true;
  onChange: (value?: DateTime) => void;
}

interface NoAllowEmptyProps extends BaseProps {
  allowEmpty?: false;
  onChange: (value: DateTime) => void;
}

export type Props = AllowEmptyProps | NoAllowEmptyProps;

export const POPUP_CLASS_NAME = 'time-of-day-picker-panel';

export const TimeOfDayPicker = ({
  minuteStep = 1,
  showHour = true,
  showSeconds = false,
  value,
  size = 'auto',
  disabled,
  disabledHours,
  disabledMinutes,
  disabledSeconds,
  id,
  placeholder,
  // note: we can't destructure allowEmpty/onChange here
  // in order to discriminate the types properly later in the onChange handler
  ...restProps
}: Props) => {
  const allowClear = restProps.allowEmpty ?? false;

  return (
    <RcPicker<Moment>
      id={id}
      generateConfig={generateConfig}
      locale={locale}
      allowClear={
        allowClear && {
          clearIcon: <Icon name="times" xstyle={styles.clearIcon} />,
        }
      }
      className={clsx(stylex.props(sizeStyles[size]).className, 'gf-time-of-day-picker')}
      classNames={{
        popup: {
          container: clsx('gf-time-of-day-picker-panel', POPUP_CLASS_NAME),
        },
      }}
      defaultValue={restProps.allowEmpty ? undefined : dateTimeAsMoment()}
      disabled={disabled}
      disabledTime={() => ({
        disabledHours,
        disabledMinutes,
        disabledSeconds,
      })}
      format={generateFormat(showHour, showSeconds)}
      minuteStep={minuteStep}
      onChange={(value) => {
        if (isDateTimeInput(value)) {
          if (restProps.allowEmpty) {
            return restProps.onChange(value ? dateTime(value) : undefined);
          } else {
            return restProps.onChange(dateTime(value));
          }
        }
      }}
      picker="time"
      placeholder={placeholder}
      showNow={false}
      needConfirm={false}
      suffixIcon={<Caret />}
      value={value ? dateTimeAsMoment(value) : value}
    />
  );
};

function generateFormat(showHour = true, showSeconds = false) {
  const maybeHour = showHour ? 'HH:' : '';
  const maybeSecond = showSeconds ? ':ss' : '';
  return maybeHour + 'mm' + maybeSecond;
}

const Caret = () => {
  return (
    <div {...stylex.props(styles.caretWrapper)}>
      <Icon name="angle-down" />
    </div>
  );
};

// The rc-picker DOM itself is styled by TimeOfDayPicker.css.
const styles = stylex.create({
  caretWrapper: {
    position: 'relative',
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'inline-block',
    color: colors['--gf-colors-text-secondary'],
  },
  clearIcon: {
    color: { default: colors['--gf-colors-text-secondary'], ':hover': colors['--gf-colors-text-max-contrast'] },
  },
});

const sizeStyles = stylex.create({
  sm: { width: '200px' },
  md: { width: '320px' },
  lg: { width: '580px' },
  auto: { width: 'auto' },
});
