import * as stylex from '@stylexjs/stylex';
import WKT from 'ol/format/WKT';
import { Geometry } from 'ol/geom';

import { type GeoCellProps, type TableCellStyles } from '../types';

export function GeoCell({ value }: GeoCellProps) {
  let disp = null;

  if (value instanceof Geometry) {
    disp = new WKT().writeGeometry(value, {
      featureProjection: 'EPSG:3857',
      dataProjection: 'EPSG:4326',
    });
  } else if (value != null) {
    disp = `${value}`;
  }

  return disp;
}

export const getStyles: TableCellStyles = () => ({ xstyle: styles.geo });

const styles = stylex.create({
  geo: {
    fontFamily: 'monospace',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
});
