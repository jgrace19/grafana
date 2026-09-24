import * as stylex from '@stylexjs/stylex';
import { useCallback, useMemo, useRef, useState } from 'react';

import { type Field, type SelectableValue } from '@grafana/data';

import { Popover } from '../../../components/Tooltip/Popover';
import { colors } from '../../../themes/stylex/tokens.stylex';
import { Icon } from '../../Icon/Icon';

import { REGEX_OPERATOR } from './FilterList';
import { FilterPopup } from './FilterPopup';
import { type TableStyles } from './styles';

interface Props {
  column: any;
  tableStyles: TableStyles;
  field?: Field;
}

export const Filter = ({ column, field, tableStyles }: Props) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [isPopoverVisible, setPopoverVisible] = useState<boolean>(false);
  const filterEnabled = useMemo(() => Boolean(column.filterValue), [column.filterValue]);
  const onShowPopover = useCallback(() => setPopoverVisible(true), [setPopoverVisible]);
  const onClosePopover = useCallback(() => setPopoverVisible(false), [setPopoverVisible]);
  const [searchFilter, setSearchFilter] = useState('');
  const [operator, setOperator] = useState<SelectableValue<string>>(REGEX_OPERATOR);

  if (!field || !field.config.custom?.filterable) {
    return null;
  }
  return (
    <button
      {...stylex.props(tableStyles.headerFilter, filterEnabled ? styles.filterIconEnabled : styles.filterIconDisabled)}
      ref={ref}
      type="button"
      onClick={onShowPopover}
    >
      <Icon name="filter" />
      {isPopoverVisible && ref.current && (
        <Popover
          content={
            <FilterPopup
              column={column}
              tableStyles={tableStyles}
              field={field}
              onClose={onClosePopover}
              searchFilter={searchFilter}
              setSearchFilter={setSearchFilter}
              operator={operator}
              setOperator={setOperator}
            />
          }
          placement="bottom-start"
          referenceElement={ref.current}
          show
        />
      )}
    </button>
  );
};

const styles = stylex.create({
  filterIconEnabled: {
    color: colors['--gf-colors-primary-text'],
  },
  filterIconDisabled: {
    color: colors['--gf-colors-text-disabled'],
  },
});
