import * as stylex from '@stylexjs/stylex';
import { type CSSProperties } from 'react';

export const logsFieldSelectorWrapperStyles = stylex.create({
  collapsedButtonContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 2,
  },
});

// IconButton has no xstyle and sets its own right margin, which a class from another stylex.props() call can't
// reliably override.
export const collapsedButtonStyle: CSSProperties = { margin: 0 };
