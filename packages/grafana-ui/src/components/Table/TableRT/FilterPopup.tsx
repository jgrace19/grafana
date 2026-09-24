// eslint-disable-next-line no-restricted-imports -- stylex: pending Label migration
import { css } from '@emotion/css';
import * as stylex from '@stylexjs/stylex';
import { useCallback, useMemo, useRef, useState } from 'react';
import * as React from 'react';

import { type Field, type SelectableValue } from '@grafana/data';
import { t, Trans } from '@grafana/i18n';

import { useTheme2 } from '../../../themes/ThemeContext';
import { colors, shadows, shape, spacing } from '../../../themes/stylex/tokens.stylex';
import { Button } from '../../Button/Button';
import { ClickOutsideWrapper } from '../../ClickOutsideWrapper/ClickOutsideWrapper';
import { Label } from '../../Forms/Label';
import { IconButton } from '../../IconButton/IconButton';
import { Stack } from '../../Layout/Stack/Stack';
import { calculateUniqueFieldValues, getFilteredOptions, valuesToOptions } from '../utils';

import { FilterList } from './FilterList';
import { type TableStyles } from './styles';

interface Props {
  column: any;
  tableStyles: TableStyles;
  onClose: () => void;
  field?: Field;
  searchFilter: string;
  setSearchFilter: (value: string) => void;
  operator: SelectableValue<string>;
  setOperator: (item: SelectableValue<string>) => void;
}

export const FilterPopup = ({
  column: { preFilteredRows, filterValue, setFilter },
  onClose,
  field,
  searchFilter,
  setSearchFilter,
  operator,
  setOperator,
}: Props) => {
  const theme = useTheme2();
  const uniqueValues = useMemo(() => calculateUniqueFieldValues(preFilteredRows, field), [preFilteredRows, field]);
  const options = useMemo(() => valuesToOptions(uniqueValues), [uniqueValues]);
  const filteredOptions = useMemo(() => getFilteredOptions(options, filterValue), [options, filterValue]);
  const [values, setValues] = useState<SelectableValue[]>(filteredOptions);
  const [matchCase, setMatchCase] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const onCancel = useCallback(() => onClose(), [onClose]);

  const onFilter = useCallback(
    (event: React.MouseEvent) => {
      const filtered = values.length ? values : undefined;

      setFilter(filtered);
      onClose();
    },
    [setFilter, values, onClose]
  );

  const onClearFilter = useCallback(
    (event: React.MouseEvent) => {
      setFilter(undefined);
      onClose();
    },
    [setFilter, onClose]
  );

  const clearFilterVisible = useMemo(() => filterValue !== undefined, [filterValue]);

  return (
    <ClickOutsideWrapper onClick={onCancel} useCapture={true}>
      {/* This is just blocking click events from bubbeling and should not have a keyboard interaction. */}
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
      <div ref={ref} {...stylex.props(styles.filterContainer)} onClick={stopPropagation}>
        <Stack direction="column" gap={3}>
          <Stack direction="column" gap={0.5}>
            <Stack justifyContent="space-between" alignItems="center">
              <Label className={labelOverride}>
                <Trans i18nKey="grafana-ui.table.filter-popup-heading">Filter by values:</Trans>
              </Label>
              <IconButton
                name="text-fields"
                tooltip={t('grafana-ui.table.filter-popup-match-case', 'Match case')}
                style={{ color: matchCase ? theme.colors.text.link : theme.colors.text.disabled }}
                onClick={() => {
                  setMatchCase((s) => !s);
                }}
              />
            </Stack>
            <div {...stylex.props(styles.listDivider)} />
            {ref.current && (
              <FilterList
                referenceElement={ref.current}
                onChange={setValues}
                values={values}
                options={options}
                caseSensitive={matchCase}
                showOperators={true}
                searchFilter={searchFilter}
                setSearchFilter={setSearchFilter}
                operator={operator}
                setOperator={setOperator}
              />
            )}
          </Stack>
          <Stack gap={3}>
            <Stack>
              <Button size="sm" onClick={onFilter}>
                <Trans i18nKey="grafana-ui.table.filter-popup-apply">Ok</Trans>
              </Button>
              <Button size="sm" variant="secondary" onClick={onCancel}>
                <Trans i18nKey="grafana-ui.table.filter-popup-cancel">Cancel</Trans>
              </Button>
            </Stack>
            {clearFilterVisible && (
              <Stack>
                <Button fill="text" size="sm" onClick={onClearFilter}>
                  <Trans i18nKey="grafana-ui.table.filter-popup-clear">Clear filter</Trans>
                </Button>
              </Stack>
            )}
          </Stack>
        </Stack>
      </div>
    </ClickOutsideWrapper>
  );
};

// stylex: pending Label migration. Label's own Emotion margin would beat a StyleX class.
const labelOverride = css({
  marginBottom: 0,
});

const styles = stylex.create({
  filterContainer: {
    width: '100%',
    minWidth: '250px',
    height: '100%',
    maxHeight: '400px',
    backgroundColor: colors['--gf-colors-background-primary'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-weak'],
    paddingTop: spacing['--gf-spacing-x2'],
    paddingRight: spacing['--gf-spacing-x2'],
    paddingBottom: spacing['--gf-spacing-x2'],
    paddingLeft: spacing['--gf-spacing-x2'],
    boxShadow: shadows['--gf-shadows-z3'],
    borderRadius: shape['--gf-shape-radius-default'],
  },
  listDivider: {
    width: '100%',
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: colors['--gf-colors-border-medium'],
    paddingTop: spacing['--gf-spacing-x0-5'],
    paddingRight: spacing['--gf-spacing-x2'],
    paddingBottom: spacing['--gf-spacing-x0-5'],
    paddingLeft: spacing['--gf-spacing-x2'],
  },
});

const stopPropagation = (event: React.MouseEvent) => {
  event.stopPropagation();
};
