
import { timeRangeLabelStyleProps } from './TimeRangeLabel.stylex'

import { memo } from 'react';


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
        <span {...timeRangeLabelStyleProps('placeholder')}>{placeholder}</span>
      )}
    </span>
  );
});

;
