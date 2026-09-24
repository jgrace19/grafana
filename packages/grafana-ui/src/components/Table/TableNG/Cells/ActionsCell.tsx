import * as stylex from '@stylexjs/stylex';

import { spacing } from '../../../../themes/stylex/tokens.stylex';
import { ActionButton } from '../../../Actions/ActionButton';
import { type ActionCellProps, type TableCellStyles } from '../types';

export const ActionsCell = ({ field, rowIdx, getActions }: ActionCellProps) => {
  const actions = getActions(field, rowIdx);

  if (actions.length === 0) {
    return null;
  }

  return actions.map((action, i) => <ActionButton key={i} action={action} variant="secondary" />);
};

export const getStyles: TableCellStyles = () => ({ xstyle: styles.actions });

const styles = stylex.create({
  actions: {
    gap: `calc(${spacing['--gf-spacing-grid-size']} * 0.75)`,
  },
});
