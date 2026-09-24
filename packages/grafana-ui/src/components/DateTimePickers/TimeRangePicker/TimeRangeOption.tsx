import clsx from 'clsx';

import { timeRangeOptionStyleProps } from './TimeRangeOption.stylex'

import { memo } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { type TimeOption } from '@grafana/data';

interface Props {
  value: TimeOption;
  selected?: boolean;
  onSelect: (option: TimeOption) => void;
  /**
   *  Input identifier. This should be the same for all options in a group.
   */
  name: string;
}

export const TimeRangeOption = memo<Props>(({ value, onSelect, selected = false, name }) => {
  // In case there are more of the same timerange in the list
  const id = uuidv4();

  return (
    <li {...timeRangeOptionStyleProps('container')}>
      <input
        {...timeRangeOptionStyleProps('radio')}
        checked={selected}
        name={name}
        type="checkbox"
        data-role="item"
        tabIndex={-1}
        id={id}
        onChange={() => onSelect(value)}
      />
      <label className={clsx(timeRangeOptionStyleProps('label'), selected && timeRangeOptionStyleProps('labelSelected'))} htmlFor={id}>
        {value.display}
      </label>
    </li>
  );
});

TimeRangeOption.displayName = 'TimeRangeOption';
