import * as stylex from '@stylexjs/stylex';

import { getCellLinks } from '../../../utils/table';
import { getCellContainerProps } from '../TableRT/styles';
import { type TableCellProps } from '../types';

export const DataLinksCell = (props: TableCellProps) => {
  const { field, row, cellProps, tableStyles } = props;

  const links = getCellLinks(field, row);

  return (
    <div {...cellProps} {...getCellContainerProps(tableStyles.cellContainerText, cellProps.style)}>
      {links?.map((link, idx) => {
        return !link.href && link.onClick == null ? (
          <span key={idx} {...stylex.props(tableStyles.cellLinkEmpty)}>
            {link.title}
          </span>
        ) : (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
          <span key={idx} {...stylex.props(tableStyles.cellLink)} onClick={link.onClick}>
            <a href={link.href} target={link.target}>
              {link.title}
            </a>
          </span>
        );
      })}
    </div>
  );
};
