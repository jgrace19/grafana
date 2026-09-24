// mostly copy/pasted from: public/app/core/components/CloseButton/CloseButton.tsx
import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { IconButton } from '../../../components/IconButton/IconButton';

type Props = {
  onClick: () => void;
  'aria-label'?: string;
  style?: React.CSSProperties;
};

export const CloseButton = ({ onClick, 'aria-label': ariaLabel, style }: Props) => {
  return (
    <IconButton aria-label={ariaLabel ?? 'Close'} xstyle={styles.button} name="times" onClick={onClick} style={style} />
  );
};

const styles = stylex.create({
  button: {
    position: 'absolute',
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    right: '5px',
    top: '6px',
  },
});
