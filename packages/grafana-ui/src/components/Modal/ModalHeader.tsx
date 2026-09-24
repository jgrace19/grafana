import * as stylex from '@stylexjs/stylex';
import { type PropsWithChildren } from 'react';

import { spacing, typography } from '../../themes/stylex/tokens.stylex';

interface Props {
  title: string;
  id?: string;
}

/** @internal */
export const ModalHeader = ({ title, children, id }: PropsWithChildren<Props>) => {
  return (
    <>
      <h2 {...stylex.props(styles.modalHeaderTitle)} id={id}>
        {title}
      </h2>
      {children}
    </>
  );
};

const styles = stylex.create({
  modalHeaderTitle: {
    fontSize: typography['--gf-typography-size-lg'],
    marginTop: 0,
    marginRight: spacing['--gf-spacing-x4'],
    marginBottom: 0,
    marginLeft: spacing['--gf-spacing-x1'],
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    top: '2px',
  },
});
