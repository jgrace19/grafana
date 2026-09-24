import * as stylex from '@stylexjs/stylex';
import { forwardRef } from 'react';

import { colors, spacing, typography } from '../../themes/stylex/tokens.stylex';

export const IndicatorsContainer = forwardRef<HTMLDivElement, React.PropsWithChildren>((props, ref) => {
  const { children } = props;

  return (
    <div {...stylex.props(styles.suffix)} ref={ref}>
      {children}
    </div>
  );
});

IndicatorsContainer.displayName = 'IndicatorsContainer';

const styles = stylex.create({
  // getInputStyles().suffix, made relative instead of absolute.
  suffix: {
    position: 'relative',
    top: 0,
    right: 0,
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
    paddingRight: spacing['--gf-spacing-x1'],
    borderLeftStyle: 'none',
    borderTopLeftRadius: 'unset',
    borderBottomLeftRadius: 'unset',
  },
});
