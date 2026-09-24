import * as stylex from '@stylexjs/stylex';

import { mergeStylexProps } from '@grafana/ui/internal';
import { bp } from '@grafana/ui/stylex/constants.stylex';
import { colors } from '@grafana/ui/stylex/tokens.stylex';

export interface Props {
  className?: string;
  leftActionsSeparator?: boolean;
}

export function NavToolbarSeparator({ className, leftActionsSeparator }: Props) {
  if (leftActionsSeparator) {
    return (
      <div
        {...mergeStylexProps(stylex.props(styles.leftActionsSeparator), {
          className,
        })}
      />
    );
  }

  return (
    <div
      {...mergeStylexProps(stylex.props(styles.line), {
        className,
      })}
    />
  );
}

const styles = stylex.create({
  leftActionsSeparator: {
    display: 'flex',
    flexGrow: 1,
  },

  line: {
    width: 1,
    backgroundColor: colors['--gf-colors-border-medium'],
    height: 24,
    flexShrink: 0,
    flexGrow: 0,

    display: {
      default: null,
      [bp.smDown]: 'none',
    },
  },
});
