import clsx from 'clsx';

import { timeZoneOptionStyleProps } from './TimeZoneOption.stylex'

import { type PropsWithChildren, type RefCallback, type JSX } from 'react';
import * as React from 'react';

import { type SelectableValue, getTimeZoneInfo } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';

import { Icon } from '../../Icon/Icon';

import { TimeZoneDescription } from './TimeZoneDescription';
import { TimeZoneOffset } from './TimeZoneOffset';
import { TimeZoneTitle } from './TimeZoneTitle';

interface Props {
  isFocused: boolean;
  isSelected: boolean;
  innerProps: JSX.IntrinsicElements['div'];
  innerRef: RefCallback<HTMLDivElement>;
  data: SelectableZone;
}

const offsetClassName = 'tz-utc-offset';

export interface SelectableZone extends SelectableValue<string> {
  searchIndex: string;
}

export const WideTimeZoneOption = (props: PropsWithChildren<Props>) => {
  const { children, innerProps, innerRef, data, isSelected, isFocused } = props;
  const timestamp = Date.now();
  const containerStyles = clsx(timeZoneOptionStyleProps('container').className, isFocused && timeZoneOptionStyleProps('containerFocused').className);

  if (typeof data.value !== 'string') {
    return null;
  }

  const timeZoneInfo = getTimeZoneInfo(data.value, timestamp);

  return (
    <div className={containerStyles} {...innerProps} ref={innerRef} data-testid={selectors.components.Select.option}>
      <div className={clsx(timeZoneOptionStyleProps('leftColumn').className, timeZoneOptionStyleProps('row').className)}>
        <div className={clsx(timeZoneOptionStyleProps('leftColumn').className, timeZoneOptionStyleProps('wideRow').className)}>
          <TimeZoneTitle title={children} />
          <div {...timeZoneOptionStyleProps('spacer')} />
          <TimeZoneDescription info={timeZoneInfo} />
        </div>
        <div {...timeZoneOptionStyleProps('rightColumn')}>
          <TimeZoneOffset
            /* Use the timeZoneInfo to pass the correct timeZone name,
               as 'Default' has value '' which defaults to browser timezone */
            timeZone={timeZoneInfo?.ianaName || data.value}
            timestamp={timestamp}
            className={offsetClassName}
          />
          {isSelected && (
            <span>
              <Icon name="check" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export const CompactTimeZoneOption = (props: React.PropsWithChildren<Props>) => {
  const { children, innerProps, innerRef, data, isSelected, isFocused } = props;
  const timestamp = Date.now();
  const containerStyles = clsx(timeZoneOptionStyleProps('container').className, isFocused && timeZoneOptionStyleProps('containerFocused').className);

  if (typeof data.value !== 'string') {
    return null;
  }

  const timeZoneInfo = getTimeZoneInfo(data.value, timestamp);

  return (
    <div className={containerStyles} {...innerProps} ref={innerRef} data-testid={selectors.components.Select.option}>
      <div {...timeZoneOptionStyleProps('body')}>
        <div {...timeZoneOptionStyleProps('row')}>
          <div {...timeZoneOptionStyleProps('leftColumn')}>
            <TimeZoneTitle title={children} />
          </div>
          <div {...timeZoneOptionStyleProps('rightColumn')}>
            {isSelected && (
              <span>
                <Icon name="check" />
              </span>
            )}
          </div>
        </div>
        <div {...timeZoneOptionStyleProps('row')}>
          <div {...timeZoneOptionStyleProps('leftColumn')}>
            <TimeZoneDescription info={timeZoneInfo} />
          </div>
          <div {...timeZoneOptionStyleProps('rightColumn')}>
            <TimeZoneOffset
              timestamp={timestamp}
              /* Use the timeZoneInfo to pass the correct timeZone name,
                 as 'Default' has value '' which defaults to browser timezone */
              timeZone={timeZoneInfo?.ianaName || data.value}
              className={offsetClassName}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

