import * as stylex from '@stylexjs/stylex';
import { type CSSProperties } from 'react';
import * as React from 'react';

import { geomapOverlayStyles } from './GeomapOverlay.stylex';

export interface OverlayProps {
  topRight1?: React.ReactNode[];
  topRight2?: React.ReactNode[];
  bottomLeft?: React.ReactNode[];
  blStyle?: CSSProperties;
}

export const GeomapOverlay = ({ topRight1, topRight2, bottomLeft, blStyle }: OverlayProps) => {
  const topRight1Exists = (topRight1 && topRight1.length > 0) ?? false;

  return (
    <div {...stylex.props(geomapOverlayStyles.overlay)}>
      {Boolean(topRight1?.length) && <div {...stylex.props(geomapOverlayStyles.tr1)}>{topRight1}</div>}
      {Boolean(topRight2?.length) && (
        <div {...stylex.props(topRight1Exists ? geomapOverlayStyles.tr2Offset : geomapOverlayStyles.tr2Default)}>
          {topRight2}
        </div>
      )}
      {Boolean(bottomLeft?.length) && (
        <div {...stylex.props(geomapOverlayStyles.bl)} style={blStyle}>
          {bottomLeft}
        </div>
      )}
    </div>
  );
};
