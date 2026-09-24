import * as stylex from '@stylexjs/stylex';
import { memo, type PropsWithChildren } from 'react';

import { colors, typography } from '../../../themes/stylex/tokens.stylex';

export const TimePickerTitle = memo<PropsWithChildren<{}>>(({ children }) => {
  return <h3 {...stylex.props(styles.text)}>{children}</h3>;
});

TimePickerTitle.displayName = 'TimePickerTitle';

const styles = stylex.create({
  text: {
    fontSize: typography['--gf-typography-size-md'],
    fontWeight: typography['--gf-typography-font-weight-medium'],
    color: colors['--gf-colors-text-primary'],
    margin: 0,
    display: 'flex',
  },
});
