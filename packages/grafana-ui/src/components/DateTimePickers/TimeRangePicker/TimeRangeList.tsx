
import { timeRangeListStyleProps } from './TimeRangeList.stylex'

import { useRef, type ReactNode } from 'react';

import { type TimeOption } from '@grafana/data';
import { t } from '@grafana/i18n';


import { TimePickerTitle } from './TimePickerTitle';
import { TimeRangeOption } from './TimeRangeOption';
import { useListFocus } from './hooks';

interface Props {
  title?: string;
  options: TimeOption[];
  value?: TimeOption;
  onChange: (option: TimeOption) => void;
  placeholderEmpty?: ReactNode;
}

export const TimeRangeList = (props: Props) => {
  const { title, options, placeholderEmpty } = props;

  if (typeof placeholderEmpty !== 'undefined' && options.length <= 0) {
    return <>{placeholderEmpty}</>;
  }

  if (!title) {
    return <Options {...props} />;
  }

  return (
    <section aria-label={title}>
      <fieldset>
        <div {...timeRangeListStyleProps('title')}>
          <TimePickerTitle>{title}</TimePickerTitle>
        </div>
        <Options {...props} />
      </fieldset>
    </section>
  );
};

const Options = ({ options, value, onChange, title }: Props) => {

  const localRef = useRef<HTMLUListElement>(null);
  const [handleKeys] = useListFocus({ localRef, options });

  return (
    <>
      <ul
        role="presentation"
        onKeyDown={handleKeys}
        ref={localRef}
        aria-roledescription={t('time-picker.time-range.aria-role', 'Time range selection')}
        {...timeRangeListStyleProps('list')}
      >
        {options.map((option, index) => (
          <TimeRangeOption
            key={keyForOption(option, index)}
            value={option}
            selected={isEqual(option, value)}
            onSelect={onChange}
            name={title ?? t('time-picker.time-range.default-title', 'Time ranges')}
          />
        ))}
      </ul>
    </>
  );
};

function keyForOption(option: TimeOption, index: number): string {
  return `${option.from}-${option.to}-${index}`;
}

function isEqual(x: TimeOption, y?: TimeOption): boolean {
  if (!y || !x) {
    return false;
  }
  return y.from === x.from && y.to === x.to;
}

