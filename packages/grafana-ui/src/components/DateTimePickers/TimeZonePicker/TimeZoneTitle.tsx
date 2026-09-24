import * as stylex from '@stylexjs/stylex';
import { type ReactNode } from 'react';

import { typography } from '../../../themes/stylex/tokens.stylex';

interface Props {
  title: string | ReactNode;
}

export const TimeZoneTitle = ({ title }: Props) => {
  if (!title) {
    return null;
  }

  return <span {...stylex.props(styles.title)}>{title}</span>;
};

const styles = stylex.create({
  title: {
    fontWeight: typography['--gf-typography-font-weight-regular'],
    textOverflow: 'ellipsis',
  },
});
