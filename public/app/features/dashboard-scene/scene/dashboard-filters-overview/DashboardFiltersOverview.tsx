import * as stylex from '@stylexjs/stylex';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';
import Skeleton from 'react-loading-skeleton';

import { t } from '@grafana/i18n';
import { type AdHocFiltersVariable, type GroupByVariable } from '@grafana/scenes';
import { Button, Stack } from '@grafana/ui';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';

import { FilterRow, GroupHeader } from './FiltersOverviewRow';
import { useFiltersOverviewState } from './useFiltersOverviewState';
import { MULTI_OPERATOR_VALUES } from './utils';

const GROUP_HEADER_HEIGHT = 32;
const FILTER_ROW_HEIGHT = 32;
const ROW_GAP = 8;
const SKELETON_ROW_COUNT = 5;

interface DashboardFiltersOverviewProps {
  adhocFilters?: AdHocFiltersVariable;
  groupByVariable?: GroupByVariable;
  onClose: () => void;
  searchQuery?: string;
}

export const DashboardFiltersOverview = ({
  adhocFilters,
  groupByVariable,
  onClose,
  searchQuery = '',
}: DashboardFiltersOverviewProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { state, listItems, operatorConfig, actions, loading, hasKeys, hasAdhocFilters, hasGroupBy } =
    useFiltersOverviewState({
      adhocFilters,
      groupByVariable,
      searchQuery,
    });

  const virtualizer = useVirtualizer({
    count: listItems.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: (index) => (listItems[index]?.type === 'group' ? GROUP_HEADER_HEIGHT : FILTER_ROW_HEIGHT),
    measureElement: (element) => element.getBoundingClientRect().height,
    overscan: 5,
    gap: ROW_GAP,
  });

  if (!hasAdhocFilters) {
    return <div>{t('dashboard.filters-overview.missing-adhoc', 'No filters available')}</div>;
  }

  if (loading) {
    return (
      <div {...stylex.props(styles.skeletonContainer)}>
        {Array.from({ length: SKELETON_ROW_COUNT }, (_, i) => (
          <Skeleton
            key={i}
            height={FILTER_ROW_HEIGHT}
            containerClassName={stylex.props(styles.skeletonRow).className}
          />
        ))}
      </div>
    );
  }

  if (!hasKeys) {
    return <div>{t('dashboard.filters-overview.empty', 'No labels available')}</div>;
  }

  return (
    <div {...stylex.props(styles.container)}>
      <div ref={scrollRef} {...stylex.props(styles.listContainer)}>
        <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const item = listItems[virtualRow.index];
            if (!item) {
              return null;
            }

            if (item.type === 'group') {
              return (
                <div
                  key={`group-${item.group}`}
                  ref={virtualizer.measureElement}
                  data-index={virtualRow.index}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <GroupHeader
                    group={item.group}
                    isOpen={state.openGroups[item.group] ?? true}
                    onToggle={actions.toggleGroup}
                  />
                </div>
              );
            }

            const { keyOption, keyValue } = item;
            const operatorValue = state.operatorsByKey[keyValue] ?? '=';

            return (
              <div
                key={`row-${keyValue}-${keyOption.group ?? 'ungrouped'}`}
                ref={virtualizer.measureElement}
                data-index={virtualRow.index}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <FilterRow
                  keyOption={keyOption}
                  keyValue={keyValue}
                  operatorValue={operatorValue}
                  isMultiOperator={MULTI_OPERATOR_VALUES.has(operatorValue)}
                  singleValue={state.singleValuesByKey[keyValue] ?? ''}
                  multiValues={state.multiValuesByKey[keyValue] ?? []}
                  isGroupBy={state.isGrouped[keyValue] ?? false}
                  isOrigin={state.isOriginByKey[keyValue] ?? false}
                  isRestorable={
                    (state.isOriginByKey[keyValue] ?? false) &&
                    (state.singleValuesByKey[keyValue] ?? '') !== (state.defaultValuesByKey[keyValue] ?? '')
                  }
                  hasGroupByVariable={hasGroupBy}
                  operatorOptions={operatorConfig.options}
                  onOperatorChange={actions.setOperator}
                  onSingleValueChange={actions.setSingleValue}
                  onMultiValuesChange={actions.setMultiValues}
                  onGroupByToggle={actions.toggleGroupBy}
                  onRestore={actions.restoreDefault}
                  getValueOptions={actions.getValueOptionsForKey}
                />
              </div>
            );
          })}
        </div>
      </div>

      <Footer
        onApply={actions.applyChanges}
        onApplyAndClose={() => {
          actions.applyChanges();
          onClose();
        }}
        onClose={onClose}
      />
    </div>
  );
};

interface FooterProps {
  onApply: () => void;
  onApplyAndClose: () => void;
  onClose: () => void;
}

const Footer = ({ onApply, onApplyAndClose, onClose }: FooterProps) => {
  return (
    <div {...stylex.props(styles.footer)}>
      <Stack direction="row" gap={1} justifyContent="flex-end">
        <Button variant="primary" onClick={onApply}>
          {t('dashboard.filters-overview.apply', 'Apply')}
        </Button>
        <Button variant="secondary" onClick={onApplyAndClose}>
          {t('dashboard.filters-overview.apply-close', 'Apply and close')}
        </Button>
        <Button variant="secondary" onClick={onClose}>
          {t('dashboard.filters-overview.close', 'Close')}
        </Button>
      </Stack>
    </div>
  );
};

const styles = stylex.create({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
    overflow: 'hidden',
  },
  skeletonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: ROW_GAP,
    width: '100%',
  },
  skeletonRow: {
    display: 'block',
    lineHeight: 1,
  },
  listContainer: {
    width: '100%',
    flex: '1',
    minHeight: 0,
    overflowY: 'auto',
  },
  footer: {
    flexShrink: 0,
    marginTop: spacing['--gf-spacing-x2'],
    paddingTop: spacing['--gf-spacing-x1-5'],
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: colors['--gf-colors-border-weak'],
  },
});
