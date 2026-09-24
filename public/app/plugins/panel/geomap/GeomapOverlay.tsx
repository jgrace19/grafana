import * as stylex from '@stylexjs/stylex';
import { type CSSProperties } from 'react';
import * as React from 'react';

import { mergeStylexProps } from '@grafana/ui/internal';

export interface OverlayProps {
  topRight1?: React.ReactNode[];
  topRight2?: React.ReactNode[];
  bottomLeft?: React.ReactNode[];
  blStyle?: CSSProperties;
}

export const GeomapOverlay = ({ topRight1, topRight2, bottomLeft, blStyle }: OverlayProps) => {
  const topRight1Exists = (topRight1 && topRight1.length > 0) ?? false;
  return (
    <div {...stylex.props(styles.overlay)}>
      {Boolean(topRight1?.length) && <div {...stylex.props(styles.TR1)}>{topRight1}</div>}
      {Boolean(topRight2?.length) && (
        <div {...stylex.props(styles.TR2, topRight1Exists && styles.TR2BelowTR1)}>{topRight2}</div>
      )}
      {Boolean(bottomLeft?.length) && (
        <div {...mergeStylexProps(stylex.props(styles.BL), { style: blStyle })}>{bottomLeft}</div>
      )}
    </div>
  );
};

const styles = stylex.create({
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 500,
    pointerEvents: 'none',
  },
  TR1: {
    right: '0.5em',
    pointerEvents: 'auto',
    position: 'absolute',
    top: '0.5em',
  },
  TR2: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    pointerEvents: 'auto',
  },
  TR2BelowTR1: {
    top: '80px',
  },
  BL: {
    position: 'absolute',
    bottom: '8px',
    left: '8px',
    pointerEvents: 'auto',
  },
});
