import { useState } from 'react';

import { TableCellDisplayMode } from '../../types';
import { MaybeWrapWithLink } from '../components/MaybeWrapWithLink';
import { type ImageCellProps, type TableCellStyles } from '../types';

export const ImageCell = ({ cellOptions, field, value, rowIdx }: ImageCellProps) => {
  const [error, setError] = useState(false);
  const { text } = field.display!(value);
  const { alt, title } =
    cellOptions.type === TableCellDisplayMode.Image ? cellOptions : { alt: undefined, title: undefined };

  if (!text) {
    return null;
  }

  return (
    <MaybeWrapWithLink field={field} rowIdx={rowIdx}>
      {error ? text : <img alt={alt} src={text} title={title} onError={() => setError(true)} />}
    </MaybeWrapWithLink>
  );
};

// The cell, its link and its image are sized by TableNG.css.
export const getStyles: TableCellStyles = () => ({ className: 'gf-table-ng-image' });
