// mostly copy/pasted from: public/app/core/components/CloseButton/CloseButton.tsx
import * as React from 'react';

import { IconButton } from '../../../components/IconButton/IconButton';

import './CloseButton.css';

type Props = {
  onClick: () => void;
  'aria-label'?: string;
  style?: React.CSSProperties;
};

export const CloseButton = ({ onClick, 'aria-label': ariaLabel, style }: Props) => {
  return (
    <IconButton
      aria-label={ariaLabel ?? 'Close'}
      className="gf-uplot-close-button"
      name="times"
      onClick={onClick}
      style={style}
    />
  );
};
