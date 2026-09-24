import * as stylex from '@stylexjs/stylex';

import { ActionButton } from '../Actions/ActionButton';

import { getCellContainerProps } from './TableRT/styles';
import { type TableCellProps } from './types';

export const ActionsCell = (props: TableCellProps) => {
  const { cellProps, tableStyles, actions } = props;

  return (
    <div {...cellProps} {...getCellContainerProps([tableStyles.cellContainerText, styles.buttonsGap], cellProps.style)}>
      {actions && actions.map((action, i) => <ActionButton key={i} action={action} variant="secondary" />)}
    </div>
  );
};

const styles = stylex.create({
  buttonsGap: {
    gap: 6,
  },
});
