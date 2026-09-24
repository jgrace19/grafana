import * as stylex from '@stylexjs/stylex';
import { type HTMLProps, type ReactNode } from 'react';

import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { spacing } from '../../themes/stylex/tokens.stylex';

export interface Props extends Omit<HTMLProps<HTMLDivElement>, 'css'> {
  children: ReactNode | ReactNode[];
}

/**
 * Used to align multiple InlineField components in one row. The row will wrap if the width of the children exceeds its own. Equivalent to the div with gf-form-inline class name. Multiple InlineFieldRows vertically stack on each other.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/forms-inlinefieldrow--docs
 */
export const InlineFieldRow = ({ children, className, ...htmlProps }: Props) => {
  return (
    <div {...mergeStylexProps(stylex.props(styles.container), { className })} {...htmlProps}>
      {children}
    </div>
  );
};

const styles = stylex.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'flex-start',
    rowGap: spacing['--gf-spacing-x0-5'],
  },
});
