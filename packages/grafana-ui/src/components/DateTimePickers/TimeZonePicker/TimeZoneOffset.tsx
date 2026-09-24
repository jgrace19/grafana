import * as stylex from '@stylexjs/stylex';

import { type TimeZone, dateTimeFormat } from '@grafana/data';

import { mergeStylexProps } from '../../../themes/stylex/mergeStylexProps';
import { colors, shape, typography } from '../../../themes/stylex/tokens.stylex';

interface Props {
  timestamp: number;
  timeZone: TimeZone | undefined;
  className?: string;
}

export const TimeZoneOffset = (props: Props) => {
  const { timestamp, timeZone, className } = props;

  if (typeof timeZone !== 'string') {
    return null;
  }

  return (
    <>
      <span {...mergeStylexProps(stylex.props(styles.offset), { className })}>
        {formatUtcOffset(timestamp, timeZone)}
      </span>
    </>
  );
};

export const formatUtcOffset = (timestamp: number, timeZone: TimeZone): string => {
  const offset = dateTimeFormat(timestamp, {
    timeZone,
    format: 'Z',
  });

  return `UTC${offset}`;
};

const styles = stylex.create({
  offset: {
    fontWeight: 'normal',
    fontSize: typography['--gf-typography-size-sm'],
    whiteSpace: 'normal',
    color: colors['--gf-colors-text-primary'],
    backgroundColor: colors['--gf-colors-background-secondary'],
    paddingTop: '2px',
    paddingBottom: '2px',
    paddingLeft: '5px',
    paddingRight: '5px',
    borderRadius: shape['--gf-shape-radius-default'],
    marginLeft: '4px',
  },
});
