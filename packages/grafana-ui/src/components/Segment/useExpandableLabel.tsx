import * as stylex from '@stylexjs/stylex';
import { useState, useRef, type ReactElement } from 'react';
import * as React from 'react';

import { colors } from '../../themes/stylex/tokens.stylex';

interface LabelProps {
  Component: ReactElement;
  onClick?: () => void;
  disabled?: boolean;
}

export const useExpandableLabel = (
  initialExpanded: boolean,
  onExpandedChange?: (expanded: boolean) => void
): [React.ComponentType<LabelProps>, number, boolean, (expanded: boolean) => void] => {
  const ref = useRef<HTMLButtonElement>(null);
  const [expanded, setExpanded] = useState<boolean>(initialExpanded);
  const [width, setWidth] = useState(0);

  const setExpandedWrapper = (expanded: boolean) => {
    setExpanded(expanded);
    if (onExpandedChange) {
      onExpandedChange(expanded);
    }
  };

  const Label = ({ Component, onClick, disabled }: LabelProps) => (
    <button
      type="button"
      {...stylex.props(styles.clearButton)}
      ref={ref}
      disabled={disabled}
      onClick={() => {
        setExpandedWrapper(true);
        if (ref && ref.current) {
          setWidth(ref.current.clientWidth * 1.25);
        }
        onClick?.();
      }}
    >
      {Component}
    </button>
  );

  return [Label, width, expanded, setExpandedWrapper];
};

const styles = stylex.create({
  // clearButtonStyles
  clearButton: {
    backgroundColor: 'transparent',
    color: colors['--gf-colors-text-primary'],
    borderStyle: 'none',
    padding: 0,
  },
});
