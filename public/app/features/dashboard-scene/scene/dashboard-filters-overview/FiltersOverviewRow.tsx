import * as stylex from '@stylexjs/stylex';
import { memo, useMemo, useState } from 'react';

import { type SelectableValue } from '@grafana/data';
import { t } from '@grafana/i18n';
import { Checkbox, type ComboboxOption, Icon, MultiSelect, Select, Tooltip } from '@grafana/ui';
import { inputStyles, mergeStylexProps } from '@grafana/ui/internal';
import { colors, components, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

import './FiltersOverviewRow.css';

interface GroupHeaderProps {
  group: string;
  isOpen: boolean;
  onToggle: (group: string, isOpen: boolean) => void;
}

export const GroupHeader = memo(({ group, isOpen, onToggle }: GroupHeaderProps) => {
  return (
    <div {...stylex.props(groupStyles.groupRow)}>
      <button
        type="button"
        {...stylex.props(groupStyles.groupButton)}
        aria-expanded={isOpen}
        onClick={() => onToggle(group, !isOpen)}
      >
        <span {...stylex.props(groupStyles.groupButtonInner)}>
          <Icon name={isOpen ? 'angle-down' : 'angle-right'} />
          <span {...stylex.props(groupStyles.groupLabel)}>{group}</span>
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
          <div {...stylex.props(inputStyles.prefixSuffix, inputStyles.suffix, rowStyles.indicators)}>
            <Tooltip content={t('dashboard.filters-overview.restore', 'Restore default value')}>
              <span
                role="button"
                tabIndex={0}
                {...stylex.props(rowStyles.restoreButton)}
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
    }, [isRestorable, keyValue, onRestore]);

    return (
      <div {...stylex.props(rowStyles.row)}>
        {/* Label cell */}
        <div {...stylex.props(rowStyles.labelCell)}>
          <Tooltip content={label}>
            <span {...stylex.props(rowStyles.labelShell)}>
              <span {...stylex.props(rowStyles.labelText)}>{label}</span>
            </span>
          </Tooltip>
        </div>

        {/* Operator cell */}
        <div
          {...mergeStylexProps(stylex.props(rowStyles.operatorCell), {
            className: 'gf-filters-overview-operator-cell',
          })}
        >
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
        <div {...mergeStylexProps(stylex.props(rowStyles.valueCell), { className: 'gf-filters-overview-value-cell' })}>
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
          <div {...stylex.props(rowStyles.groupByCell)}>
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

const groupStyles = stylex.create({
  groupRow: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    paddingTop: spacing['--gf-spacing-x1'],
    paddingRight: spacing['--gf-spacing-x0-5'],
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: spacing['--gf-spacing-x0-5'],
  },
  groupButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderStyle: 'none',
    padding: 0,
    cursor: 'pointer',
    color: 'inherit',
    textAlign: 'left',
  },
  groupButtonInner: {
    display: 'flex',
    alignItems: 'center',
    gap: `calc(${spacing['--gf-spacing-grid-size']} * 0.75)`,
  },
  groupLabel: {
    fontWeight: typography['--gf-typography-font-weight-medium'],
  },
});

// Focused/hovered cells are layered over their overlapping neighbours so their borders render on top. The
// Select/MultiSelect inside the operator and value cells is styled by FiltersOverviewRow.css.
const rowStyles = stylex.create({
  row: {
    display: 'flex',
    alignItems: 'flex-start',
    width: '100%',
  },
  labelCell: {
    position: 'relative',
    zIndex: { default: 0, ':hover': 1, ':focus-within': 3 },
    flexGrow: '0',
    flexShrink: '0',
    flexBasis: '25%',
    maxWidth: '25%',
    minWidth: '25%',
  },
  operatorCell: {
    position: 'relative',
    zIndex: { default: 0, ':hover': 1, ':focus-within': 3 },
    flexGrow: '0',
    flexShrink: '0',
    flexBasis: 'auto',
    width: spacing['--gf-spacing-x8'],
    marginLeft: -1,
  },
  valueCell: {
    position: 'relative',
    zIndex: { default: 0, ':hover': 1, ':focus-within': 3 },
    flexGrow: '1',
    flexShrink: '1',
    flexBasis: '0',
    minWidth: 0,
    marginLeft: -1,
  },
  // Input's suffix, positioned in the flow instead of absolutely.
  indicators: {
    position: 'relative',
  },
  restoreButton: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    color: { default: colors['--gf-colors-text-secondary'], ':hover': colors['--gf-colors-text-primary'] },
  },
  groupByCell: {
    flexGrow: '0',
    flexShrink: '0',
    flexBasis: 'auto',
    width: spacing['--gf-spacing-x10'],
    display: 'flex',
    alignItems: 'center',
    alignSelf: 'center',
    marginLeft: spacing['--gf-spacing-x1'],
  },
  labelShell: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: spacing['--gf-spacing-x1'],
    fontWeight: typography['--gf-typography-font-weight-medium'],
    fontSize: typography['--gf-typography-size-sm'],
    backgroundColor: colors['--gf-colors-background-secondary'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: components['--gf-components-input-border-color'],
    height: `calc(${spacing['--gf-spacing-grid-size']} * ${components['--gf-components-height-md']})`,
    lineHeight: `calc(${spacing['--gf-spacing-grid-size']} * ${components['--gf-components-height-md']})`,
    borderTopLeftRadius: shape['--gf-shape-radius-default'],
    borderTopRightRadius: 'unset',
    borderBottomRightRadius: 'unset',
    borderBottomLeftRadius: shape['--gf-shape-radius-default'],
    width: '100%',
    minWidth: 0,
    boxSizing: 'border-box',
    color: colors['--gf-colors-text-primary'],
  },
  labelText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    minWidth: 0,
    flex: '1',
  },
});
