import * as stylex from '@stylexjs/stylex';
import { useMemo } from 'react';

import { type TimeZoneInfo } from '@grafana/data';

import { colors, typography } from '../../../themes/stylex/tokens.stylex';

interface Props {
  info?: TimeZoneInfo;
}

export const TimeZoneDescription = ({ info }: Props) => {
  const description = useDescription(info);

  if (!info) {
    return null;
  }

  return <div {...stylex.props(styles.description)}>{description}</div>;
};

const useDescription = (info?: TimeZoneInfo): string => {
  return useMemo(() => {
    const parts: string[] = [];

    if (!info) {
      return '';
    }

    if (info.name === 'Europe/Simferopol') {
      // See https://github.com/grafana/grafana/issues/72031
      return 'Ukraine, EEST';
    }

    if (info.countries.length > 0) {
      const country = info.countries[0];
      parts.push(country.name);
    }

    if (info.abbreviation) {
      parts.push(info.abbreviation);
    }

    return parts.join(', ');
  }, [info]);
};

const styles = stylex.create({
  description: {
    fontWeight: 'normal',
    fontSize: typography['--gf-typography-size-sm'],
    color: colors['--gf-colors-text-secondary'],
    whiteSpace: 'normal',
    textOverflow: 'ellipsis',
  },
});
