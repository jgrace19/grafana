import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { filtersOverviewRowStyles } from './FiltersOverviewRow.stylex';
import { memo, useMemo, useState } from 'react';

import { t } from '@grafana/i18n';
import {Checkbox, type ComboboxOption, getInputStyles, Icon, MultiSelect, Select, Tooltip} from '@grafana/ui';

interface GroupHeaderProps {
  group: string;
  isOpen: boolean;
  onToggle: (group: string, isOpen: boolean) => void;
}

export const GroupHeader = memo(({ group, isOpen, onToggle }: GroupHeaderProps) => {


  return (
    <div {...stylex.props(filtersOverviewRowStyles.groupRow)}>
      <button
        type="button"
        {...stylex.props(filtersOverviewRowStyles.groupButton)}
        aria-expanded={isOpen}
        onClick={() => onToggle(group, !isOpen)}
      >
        <span {...stylex.props(filtersOverviewRowStyles.groupButtonInner)}>
          <Icon name={isOpen ? 'angle-down' : 'angle-right'} />
          <span {...stylex.props(filtersOverviewRowStyles.groupLabel)}>{group}</span>
        </span>
      </button>
    </div>
  );
});

GroupHeader.displayName = 'GroupHeader';

const OPERATOR_MENU_MIN_WIDTH = 200;

const WideMenu = ({
  children,
  innerRef,
  innerProps,
}: {
  children: React.ReactNode;
  innerRef: React.Ref<HTMLDivElement>;
  innerProps: React.HTMLAttributes<HTMLDivElement> & { style?: React.CSSProperties };
}) => (
  <div ref={innerRef} {...innerProps} style={{ ...innerProps.style, minWidth: OPERATOR_MENU_MIN_WIDTH }}>
    {children}
  </div>
);

interface FilterRowProps {
  keyOption: SelectableValue<string>;
  keyValue: string;
  operatorValue: string;
  isMultiOperator: boolean;
  singleValue: string;
  multiValues: string[];
  isGroupBy: boolean;
  isOrigin: boolean;
  isRestorable: boolean;
  hasGroupByVariable: boolean;
  operatorOptions: Array<SelectableValue<string>>;
  onOperatorChange: (key: string, operator: string) => void;
  onSingleValueChange: (key: string, value: string) => void;
  onMultiValuesChange: (key: string, values: string[]) => void;
  onGroupByToggle: (key: string, nextValue: boolean) => void;
  onRestore: (key: string) => void;
  getValueOptions: (key: string, operator: string, inputValue: string) => Promise<Array<ComboboxOption<string>>>;
}

export const FilterRow = memo(
  ({
    keyOption,
    keyValue,
    operatorValue,
    isMultiOperator,
    singleValue,
    multiValues,
    isGroupBy,
    isOrigin,
    isRestorable,
    hasGroupByVariable,
    operatorOptions,
    onOperatorChange,
    onSingleValueChange,
    onMultiValuesChange,
    onGroupByToggle,
    onRestore,
    getValueOptions,
  }: FilterRowProps) => {

    const label = keyOption.label ?? keyValue;

    const [valueOptions, setValueOptions] = useState<Array<SelectableValue<string>>>([]);
    const [isLoadingValues, setIsLoadingValues] = useState(false);
    const [isValuesMenuOpen, setIsValuesMenuOpen] = useState(false);

    const handleOpenValuesMenu = async () => {
      setIsLoadingValues(true);
      const options = await getValueOptions(keyValue, operatorValue, '');
      setValueOptions(options.map((o) => ({ label: o.label, value: o.value })));
      setIsLoadingValues(false);
      setIsValuesMenuOpen(true);
    };

    const handleCloseValuesMenu = () => {
      setIsValuesMenuOpen(false);
    };

    const restoreIndicator = useMemo(() => {
      if (!isRestorable) {
        return undefined;
      }
      return {
        IndicatorsContainer: (props: React.PropsWithChildren) => (
          <div {...stylex.props(filtersOverviewRowStyles.indicators)}>
            <Tooltip content={t('dashboard.filters-overview.restore', 'Restore default value')}>
              <span
                role="button"
                tabIndex={0}
                {...stylex.props(filtersOverviewRowStyles.restoreButton)}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  onRestore(keyValue);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.stopPropagation();
                    onRestore(keyValue);
                  }
                }}
              >
                <Icon name="history" />
              </span>
            </Tooltip>
            {props.children}
          </div>
        ),
      };
    }, [isRestorable, keyValue, onRestore, filtersOverviewRowStyles.indicators, filtersOverviewRowStyles.restoreButton]);

    return (
      <div {...stylex.props(filtersOverviewRowStyles.row)}>
        {/* Label cell */}
        <div {...stylex.props(filtersOverviewRowStyles.labelCell)}>
          <Tooltip content={label}>
            <span {...stylex.props(filtersOverviewRowStyles.labelShell)}>
              <span {...stylex.props(filtersOverviewRowStyles.labelText)}>{label}</span>
            </span>
          </Tooltip>
        </div>

        {/* Operator cell */}
        <div {...stylex.props(filtersOverviewRowStyles.operatorCell)}>
          <Select<string>
            aria-label={t('dashboard.filters-overview.operator.aria-label', 'Operator')}
            options={operatorOptions}
            value={operatorValue}
            placeholder={t('dashboard.filters-overview.operator.placeholder', 'Select operator')}
            disabled={isOrigin}
            components={{ Menu: WideMenu }}
            onChange={(option) => {
              if (option?.value) {
                onOperatorChange(keyValue, option.value);
              }
            }}
          />
        </div>

        {/* Value cell */}
        <div {...stylex.props(filtersOverviewRowStyles.valueCell)}>
          {isMultiOperator ? (
            <MultiSelect<string>
              aria-label={t('dashboard.filters-overview.multi.value.aria-label', 'Value')}
              options={valueOptions}
              value={multiValues.map((v) => ({ label: v, value: v }))}
              placeholder={t('dashboard.filters-overview.multi.value.placeholder', 'Select values')}
              allowCustomValue
              isClearable
              isLoading={isLoadingValues}
              isOpen={isValuesMenuOpen}
              closeMenuOnSelect={false}
              components={restoreIndicator}
              onOpenMenu={handleOpenValuesMenu}
              onCloseMenu={handleCloseValuesMenu}
              onChange={(selections) => {
                onMultiValuesChange(
                  keyValue,
                  selections.map((s) => s.value ?? '')
                );
              }}
            />
          ) : (
            <Select<string>
              aria-label={t('dashboard.filters-overview.value.aria-label', 'Value')}
              options={valueOptions}
              value={singleValue ? { label: singleValue, value: singleValue } : null}
              placeholder={t('dashboard.filters-overview.value.placeholder', 'Select value')}
              allowCustomValue
              isClearable
              isLoading={isLoadingValues}
              isOpen={isValuesMenuOpen}
              components={restoreIndicator}
              onOpenMenu={handleOpenValuesMenu}
              onCloseMenu={handleCloseValuesMenu}
              onChange={(selection) => {
                onSingleValueChange(keyValue, selection?.value ?? '');
              }}
            />
          )}
        </div>

        {/* GroupBy cell */}
        {hasGroupByVariable && (
          <div {...stylex.props(filtersOverviewRowStyles.groupByCell)}>
            <Checkbox
              value={isGroupBy}
              label={t('dashboard.filters-overview.groupby', 'GroupBy')}
              onChange={() => onGroupByToggle(keyValue, !isGroupBy)}
            />
          </div>
        )}
      </div>
    );
  }
);

FilterRow.displayName = 'FilterRow';

// Styles
