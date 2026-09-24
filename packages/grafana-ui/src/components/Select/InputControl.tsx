import * as stylex from '@stylexjs/stylex';
import { forwardRef, type JSX } from 'react';

import { colors, spacing, typography } from '../../themes/stylex/tokens.stylex';

interface InputControlProps {
  /** Show an icon as a prefix in the input */
  prefix?: JSX.Element | string | null;
  focused: boolean;
  invalid: boolean;
  disabled: boolean;
  innerProps: JSX.IntrinsicElements['div'];
}

export const InputControl = forwardRef<HTMLDivElement, React.PropsWithChildren<InputControlProps>>(
  function InputControl({ focused, invalid, disabled, children, innerProps, prefix, ...otherProps }, ref) {
    return (
      <div {...stylex.props(styles.input, !!prefix && styles.withPrefix)} {...innerProps} ref={ref}>
        {prefix && <div {...stylex.props(styles.prefix)}>{prefix}</div>}
        {children}
      </div>
    );
  }
);

const styles = stylex.create({
  input: {
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: spacing['--gf-spacing-x1'],
    width: '100%',
    maxWidth: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    position: 'relative',
    boxSizing: 'border-box',
  },
  withPrefix: {
    paddingLeft: 0,
  },
  // getInputStyles().prefix, made relative instead of absolute.
  prefix: {
    position: 'relative',
    top: 0,
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 0,
    flexShrink: 0,
    fontSize: typography['--gf-typography-size-md'],
    height: '100%',
    minWidth: '28px',
    color: colors['--gf-colors-text-secondary'],
    paddingLeft: spacing['--gf-spacing-x1'],
    paddingRight: spacing['--gf-spacing-x0-5'],
    borderRightStyle: 'none',
    borderTopRightRadius: 'unset',
    borderBottomRightRadius: 'unset',
  },
});
