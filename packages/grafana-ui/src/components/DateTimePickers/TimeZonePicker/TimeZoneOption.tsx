import * as stylex from '@stylexjs/stylex';
import { type PropsWithChildren, type RefCallback, type JSX } from 'react';
import * as React from 'react';

import { type SelectableValue, getTimeZoneInfo } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';

import { colors, typography } from '../../../themes/stylex/tokens.stylex';
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

  if (typeof data.value !== 'string') {
    return null;
  }

  const timeZoneInfo = getTimeZoneInfo(data.value, timestamp);

  return (
    <div
      {...stylex.props(styles.container, isFocused && styles.containerFocused)}
      {...innerProps}
      ref={innerRef}
      data-testid={selectors.components.Select.option}
    >
      <div {...stylex.props(styles.leftColumn, styles.row)}>
        <div {...stylex.props(styles.leftColumn, styles.wideRow)}>
          <TimeZoneTitle title={children} />
          <div {...stylex.props(styles.spacer)} />
          <TimeZoneDescription info={timeZoneInfo} />
        </div>
        <div {...stylex.props(styles.rightColumn)}>
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

  if (typeof data.value !== 'string') {
    return null;
  }

  const timeZoneInfo = getTimeZoneInfo(data.value, timestamp);

  return (
    <div
      {...stylex.props(styles.container, isFocused && styles.containerFocused)}
      {...innerProps}
      ref={innerRef}
      data-testid={selectors.components.Select.option}
    >
      <div {...stylex.props(styles.body)}>
        <div {...stylex.props(styles.row)}>
          <div {...stylex.props(styles.leftColumn)}>
            <TimeZoneTitle title={children} />
          </div>
          <div {...stylex.props(styles.rightColumn)}>
            {isSelected && (
              <span>
                <Icon name="check" />
              </span>
            )}
          </div>
        </div>
        <div {...stylex.props(styles.row)}>
          <div {...stylex.props(styles.leftColumn)}>
            <TimeZoneDescription info={timeZoneInfo} />
          </div>
          <div {...stylex.props(styles.rightColumn)}>
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

const styles = stylex.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    flexShrink: 0,
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    paddingTop: '6px',
    paddingRight: '8px',
    paddingBottom: '4px',
    paddingLeft: '8px',
    backgroundColor: { default: null, ':hover': colors['--gf-colors-action-hover'] },
  },
  containerFocused: {
    backgroundColor: colors['--gf-colors-action-hover'],
  },
  body: {
    display: 'flex',
    fontWeight: typography['--gf-typography-font-weight-medium'],
    flexDirection: 'column',
    flexGrow: 1,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  leftColumn: {
    flexGrow: 1,
    textOverflow: 'ellipsis',
  },
  rightColumn: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  wideRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  spacer: {
    marginLeft: '6px',
  },
});
