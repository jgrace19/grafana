import * as stylex from '@stylexjs/stylex';
import { type ReactNode } from 'react';

import { colors, shape } from '@grafana/ui/stylex/tokens.stylex';

interface QueryLibraryEditingContainerProps {
  children: ReactNode;
}

export function QueryLibraryEditingContainer({ children }: QueryLibraryEditingContainerProps) {
  return <div {...stylex.props(styles.container)}>{children}</div>;
}

const styles = stylex.create({
  container: {
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-primary-main'],
    borderTopLeftRadius: 'unset',
    borderTopRightRadius: 'unset',
    borderBottomLeftRadius: shape['--gf-shape-radius-default'],
    borderBottomRightRadius: shape['--gf-shape-radius-default'],
    overflow: 'hidden',
  },
});
