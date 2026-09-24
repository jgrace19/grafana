import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { spacing } from '../../themes/stylex/tokens.stylex';

export interface Props {
  grow?: boolean;
  className?: string;
}

/** @beta */
export const InlineSegmentGroup = ({ children, className, grow, ...htmlProps }: React.PropsWithChildren<Props>) => {
  return (
    <div {...mergeStylexProps(stylex.props(styles.container, grow && styles.grow), { className })} {...htmlProps}>
      {children}
    </div>
  );
};

InlineSegmentGroup.displayName = 'InlineSegmentGroup';

const styles = stylex.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    textAlign: 'left',
    position: 'relative',
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 'auto',
    marginBottom: spacing['--gf-spacing-x0-5'],
  },
  grow: {
    flexGrow: 1,
  },
});
