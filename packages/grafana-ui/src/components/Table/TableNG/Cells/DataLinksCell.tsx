import * as stylex from '@stylexjs/stylex';
import { clsx } from 'clsx';

import { type DataLinksCellProps, type TableCellStyles } from '../types';
import { getCellLinks } from '../utils';

export const DataLinksCell = ({ field, rowIdx }: DataLinksCellProps) => {
  const links = getCellLinks(field, rowIdx);

  if (!links?.length) {
    return null;
  }

  return links.map((link, idx) => (
    <a key={idx} onClick={link.onClick} href={link.href} target={link.target}>
      {link.title}
    </a>
  ));
};

// The link rules (`> a`) are in TableNG.css.
export const getStyles: TableCellStyles = (_theme, { textWrap, textAlign }) => ({
  xstyle: textWrap && [styles.wrap, alignItemsStyles[textAlign]],
  className: clsx('gf-table-ng-data-links', !textWrap && 'gf-table-ng-data-links-inline'),
});

const styles = stylex.create({
  wrap: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
});

// Applied after the default and max-height cell styles, so it no longer needs Emotion's `!important`.
const alignItemsStyles = stylex.create({
  left: { alignItems: 'flex-start' },
  right: { alignItems: 'flex-end' },
  center: { alignItems: 'center' },
});
