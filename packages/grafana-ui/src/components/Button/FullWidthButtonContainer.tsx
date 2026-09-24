import * as stylex from '@stylexjs/stylex';
import { clsx } from 'clsx';
import * as React from 'react';

import './FullWidthButtonContainer.css';

export interface Props {
  className?: string;
}

export const FullWidthButtonContainer = ({ className, children }: React.PropsWithChildren<Props>) => {
  return (
    <div className={clsx(stylex.props(styles.container).className, 'gf-full-width-button-container', className)}>
      {children}
    </div>
  );
};

// Children are styled by FullWidthButtonContainer.css.
const styles = stylex.create({
  container: {
    display: 'flex',
  },
});
