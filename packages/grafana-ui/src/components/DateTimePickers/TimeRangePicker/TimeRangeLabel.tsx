import * as stylex from '@stylexjs/stylex';
import { memo } from 'react';

import { colors } from '../../../themes/stylex/tokens.stylex';
import { TimePickerButtonLabel, type TimeRangePickerProps } from '../TimeRangePicker';
import { isValidTimeRange } from '../utils';

type LabelProps = Pick<TimeRangePickerProps, 'hideText' | 'value' | 'timeZone'> & {
  placeholder?: string;
  className?: string;
};

export const TimeRangeLabel = memo<LabelProps>(function TimePickerLabel({
  hideText,
  value,
  timeZone = 'browser',
  placeholder = 'No time range selected',
  className,
}) {
  if (hideText) {
    return null;
  }

  return (
    <span className={className}>
      {isValidTimeRange(value) ? (
        <TimePickerButtonLabel value={value} timeZone={timeZone} />
      ) : (
        <span {...stylex.props(styles.placeholder)}>{placeholder}</span>
      )}
    </span>
  );
});

const styles = stylex.create({
  placeholder: {
    color: colors['--gf-colors-text-disabled'],
    opacity: 1,
  },
});
