import * as stylex from '@stylexjs/stylex';

import { t } from '@grafana/i18n';

import { mergeStylexProps } from '../../../themes/stylex/mergeStylexProps';
import { Icon } from '../../Icon/Icon';
import { type GrafanaTableRow } from '../types';

import { type TableStyles } from './styles';

export interface Props {
  row: GrafanaTableRow;
  tableStyles: TableStyles;
}

export function RowExpander({ row, tableStyles }: Props) {
  const { style, ...toggleProps } = row.getToggleRowExpandedProps();
  return (
    <div {...toggleProps} {...mergeStylexProps(stylex.props(tableStyles.expanderCell), { style })}>
      <Icon
        aria-label={
          row.isExpanded
            ? t('grafana-ui.row-expander.collapse', 'Collapse row')
            : t('grafana-ui.row-expander.expand', 'Expand row')
        }
        name={row.isExpanded ? 'angle-down' : 'angle-right'}
        size="lg"
      />
    </div>
  );
}
