import * as stylex from '@stylexjs/stylex';
import { useCallback } from 'react';

import { t, Trans } from '@grafana/i18n';
import {
  type AdHocFiltersVariable,
  GroupByVariable,
  type VariableValueOption,
  type VariableValueSingle,
} from '@grafana/scenes';
import { Button, Checkbox, ClickOutsideWrapper, FilterInput, Spinner, Stack } from '@grafana/ui';
import { colors, shadows, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';

interface Props {
  groupByVariable: GroupByVariable | AdHocFiltersVariable;
  onCancel: () => void;
  isLoading: boolean;
  searchValue: string;
  setSearchValue: (value: string) => void;
  options: VariableValueOption[];
  values: VariableValueSingle[];
  onValuesChange: (value: VariableValueSingle[]) => void;
}

export function PanelGroupByActionPopover({
  groupByVariable,
  onCancel,
  isLoading,
  searchValue,
  setSearchValue,
  options,
  values,
  onValuesChange,
}: Props) {
  const onCheckedChanged = useCallback(
    (option: VariableValueOption) => (event: React.FormEvent<HTMLInputElement>) => {
      const newValues = event.currentTarget.checked
        ? values.concat(option.value)
        : values.filter((c) => c !== option.value);

      onValuesChange(newValues);
    },
    [onValuesChange, values]
  );

  const isChecked = (option: VariableValueOption) => {
    return values.includes(option.value);
  };

  const handleApply = useCallback(() => {
    if (groupByVariable instanceof GroupByVariable) {
      groupByVariable.changeValueTo(values, values.map(String), true);
    } else {
      const selectedKeys = new Set(values.map(String));
      const originFilters = groupByVariable.state.originFilters ?? [];
      const originGroupByKeys = new Set<string>();

      const updatedOriginFilters = originFilters.map((f) => {
        if (f.operator !== 'groupBy') {
          return f;
        }
        originGroupByKeys.add(f.key);
        const shouldBeActive = selectedKeys.has(f.key);
        return { ...f, dismissedGroupBy: !shouldBeActive };
      });

      const nonGroupByFilters = groupByVariable.state.filters.filter((f) => f.operator !== 'groupBy');
      const newUserGroupBys = values
        .filter((v) => !originGroupByKeys.has(String(v)))
        .map((v) => ({ key: String(v), operator: 'groupBy', value: '' }));

      const allOriginsRestored = updatedOriginFilters
        .filter((f) => f.operator === 'groupBy' && f.origin)
        .every((f) => !f.dismissedGroupBy);
      const isBackToDefaults = allOriginsRestored && newUserGroupBys.length === 0;

      const finalOriginFilters = updatedOriginFilters.map((f) => {
        if (f.operator !== 'groupBy' || !f.origin) {
          return f;
        }
        return { ...f, restorable: !isBackToDefaults };
      });

      groupByVariable.setState({
        originFilters: finalOriginFilters,
        filters: [...nonGroupByFilters, ...newUserGroupBys],
      });
    }
    onCancel();
  }, [groupByVariable, onCancel, values]);

  const groupByHasCurrentValues =
    groupByVariable instanceof GroupByVariable
      ? Array.isArray(groupByVariable.state.value)
        ? groupByVariable.state.value.length > 0
        : Boolean(groupByVariable.state.value)
      : groupByVariable.state.filters.some((f) => f.operator === 'groupBy') ||
        (groupByVariable.state.originFilters ?? []).some((f) => f.operator === 'groupBy' && !f.dismissedGroupBy);

  return (
    <ClickOutsideWrapper onClick={onCancel} useCapture={true}>
      {/* This is just blocking click events from bubbeling and should not have a keyboard interaction. */}
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
      <div {...stylex.props(styles.menuContainer)} onClick={(ev) => ev.stopPropagation()}>
        <Stack direction="column">
          <div {...stylex.props(styles.searchContainer)}>
            <FilterInput
              placeholder={t('panel-group-by.search-placeholder', 'Search')}
              value={searchValue}
              onChange={setSearchValue}
              escapeRegex={false}
            />
          </div>

          <div {...stylex.props(styles.listContainer)}>
            {isLoading ? (
              <div {...stylex.props(styles.emptyMessage)}>
                <Spinner size="sm" inline />
                &nbsp;
                <Trans i18nKey="panel-group-by.loading">Loading options</Trans>
              </div>
            ) : options.length === 0 ? (
              <div {...stylex.props(styles.emptyMessage)}>
                <Trans i18nKey="panel-group-by.no-options">No options found</Trans>
              </div>
            ) : (
              options.map((option) => {
                return (
                  <div key={String(option.value)} {...stylex.props(styles.option)}>
                    <Checkbox value={isChecked(option)} label={option.label} onChange={onCheckedChanged(option)} />
                  </div>
                );
              })
            )}
          </div>

          <Stack justifyContent="end" direction="row-reverse">
            <Button size="sm" onClick={handleApply} disabled={!values.length && !groupByHasCurrentValues}>
              <Trans i18nKey="grafana-ui.table.filter-popup-apply">Ok</Trans>
            </Button>
            <Button size="sm" variant="secondary" onClick={onCancel}>
              <Trans i18nKey="grafana-ui.table.filter-popup-cancel">Cancel</Trans>
            </Button>
          </Stack>
        </Stack>
      </div>
    </ClickOutsideWrapper>
  );
}

const styles = stylex.create({
  menuContainer: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: colors['--gf-colors-background-elevated'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-weak'],
    borderRadius: shape['--gf-shape-radius-default'],
    boxShadow: shadows['--gf-shadows-z3'],
    padding: spacing['--gf-spacing-x2'],
  },
  searchContainer: {
    width: '100%',
    paddingBottom: spacing['--gf-spacing-x1'],
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors['--gf-colors-border-weak'],
  },
  listContainer: {
    flex: '1',
    overflow: 'auto',
    minHeight: '100px',
    maxHeight: '300px',
    padding: spacing['--gf-spacing-x0-5'],
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors['--gf-colors-border-weak'],
  },
  option: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing['--gf-spacing-x1'],
    padding: spacing['--gf-spacing-x1'],
    cursor: 'pointer',
    borderRadius: shape['--gf-shape-radius-default'],
    backgroundColor: { default: null, ':hover': colors['--gf-colors-background-secondary'] },
    outlineWidth: { default: null, ':focus-visible': '2px' },
    outlineStyle: { default: null, ':focus-visible': 'solid' },
    outlineColor: { default: null, ':focus-visible': colors['--gf-colors-primary-border'] },
    outlineOffset: { default: null, ':focus-visible': '-2px' },
  },
  emptyMessage: {
    padding: spacing['--gf-spacing-x2'],
    textAlign: 'center',
    color: colors['--gf-colors-text-secondary'],
  },
});
