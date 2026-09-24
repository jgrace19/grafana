import { actionsCellStyleProps } from './ActionsCell.stylex';
import clsx from 'clsx';


import { ActionButton } from '../Actions/ActionButton';

import { type TableCellProps } from './types';

export const ActionsCell = (props: TableCellProps) => {
  const { cellProps, tableStyles, actions } = props;

  return (
    <div {...cellProps} className={clsx(tableStyles.cellContainerText, actionsCellStyleProps('buttonsGap'))}>
      {actions && actions.map((action, i) => <ActionButton key={i} action={action} variant="secondary" />)}
    </div>
  );
};

