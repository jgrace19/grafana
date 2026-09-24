import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useToggle } from 'react-use';

import { Trans, t } from '@grafana/i18n';
import { useQueryRunner, useSceneContext } from '@grafana/scenes-react';
import { Button, FilterInput, Icon, LoadingBar, ScrollContainer, Stack, Text, Tooltip } from '@grafana/ui';
import { colors, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

import { COMBINED_FILTER_LABEL_KEYS } from '../../constants';
import { countInstances } from '../SummaryStats';
import { summaryInstanceCountQuery } from '../queries';
import { type LabelStats, useLabelsBreakdown } from '../useLabelsBreakdown';
import {
  addOrReplaceFilter,
  cleanAlertStateFilter,
  removeFilter,
  useClearAllFilters,
  useFilterValue,
  useQueryFilter,
  useRegexFilterValue,
} from '../utils';

import { AllLabelsContent } from './LabelsContent';
import { SeverityFilter } from './SeverityFilter';
import { canonicalSeverity } from './severity';

export const LABELS_COLUMN_WIDTH = 250;
const COLLAPSED_WIDTH = 36;
const SKELETON_ROW_COUNT = 6;

function LabelsSkeleton() {
  return (
    <div {...stylex.props(styles.skeletonList)}>
      {Array.from({ length: SKELETON_ROW_COUNT }, (_, i) => (
        <div key={i} {...stylex.props(styles.skeletonRow)}>
          <Skeleton width={16} height={16} />
          <span {...stylex.props(styles.skeletonName)}>
            <Skeleton width="100%" height={16} />
          </span>
          <div {...stylex.props(styles.skeletonBadges)}>
            <Skeleton width={22} height={16} />
            <Skeleton width={22} height={16} />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Always-visible labels column rendered to the left of the main workbench content.
 * Contains a state filter (firing / pending) and the full label breakdown.
 */
export function LabelsColumn() {
  const { labels, isLoading } = useLabelsBreakdown();
  const isFirstLoad = isLoading && labels.length === 0;
  const isSubsequentLoad = isLoading && labels.length > 0;
  const [open, toggleOpen] = useToggle(true);
  const [labelFilter, setLabelFilter] = useState('');
  const activeSeverityValue = useRegexFilterValue('severity');
  const activeSidebarFilterValues: Record<SidebarFilterKey, string | undefined> = {
    alertname: useFilterValue('alertname'),
    grafana_folder: useFilterValue('grafana_folder'),
    service: useFilterValue('service'),
    team: useFilterValue('team'),
    namespace: useFilterValue('namespace'),
  };
  const showSeverityFilter = hasSeverityFilterValues(labels) || Boolean(activeSeverityValue);
  const visibleSidebarFilters = SIDEBAR_FILTERS.map((filter) => {
    const values = getSidebarFilterValues(labels, filter.key);
    const activeValue = activeSidebarFilterValues[filter.key];
    return { ...filter, values, activeValue };
  }).filter((filter) => filter.values.length > 0 || Boolean(filter.activeValue));
  const { hasActiveFilters, clearAllFilters } = useClearAllFilters();

  return (
    <div {...stylex.props(styles.column, !open && styles.columnCollapsed)}>
      <div {...stylex.props(styles.collapseButtonRow)}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Tooltip
            content={
              open
                ? t('alerting.triage.collapse-sidebar', 'Collapse sidebar')
                : t('alerting.triage.expand-sidebar', 'Expand sidebar')
            }
            placement="right"
          >
            <button
              {...stylex.props(styles.collapseButton)}
              onClick={toggleOpen}
              aria-label={
                open
                  ? t('alerting.triage.collapse-sidebar', 'Collapse sidebar')
                  : t('alerting.triage.expand-sidebar', 'Expand sidebar')
              }
            >
              <Icon name={open ? 'angle-left' : 'angle-right'} size="sm" />
            </button>
          </Tooltip>
          {open && (
            <Button size="sm" variant="primary" fill="text" onClick={clearAllFilters} disabled={!hasActiveFilters}>
              <Trans i18nKey="alerting.triage.clear-filters">Clear filters</Trans>
            </Button>
          )}
        </Stack>
      </div>
      {open && (
        <ScrollContainer scrollbarWidth="thin">
          <div {...stylex.props(styles.inner)}>
            <div {...stylex.props(styles.section)}>
              <Text weight="medium" variant="bodySmall" color="secondary">
                <Trans i18nKey="alerting.triage.state-filter-title">State</Trans>
              </Text>
              <StateFilter />
            </div>
            <div {...stylex.props(styles.divider)} />
            {showSeverityFilter && (
              <>
                <div {...stylex.props(styles.section)}>
                  <Text weight="medium" variant="bodySmall" color="secondary">
                    <Trans i18nKey="alerting.triage.severity-filter-title">Severity</Trans>
                  </Text>
                  <SeverityFilter labels={labels} />
                </div>
                <div {...stylex.props(styles.divider)} />
              </>
            )}
            {visibleSidebarFilters.map(({ key, labelI18nKey, defaultLabel, values, activeValue }) => (
              <div key={key}>
                <div {...stylex.props(styles.section)}>
                  <Text weight="medium" variant="bodySmall" color="secondary">
                    {t(labelI18nKey, defaultLabel)}
                  </Text>
                  <SidebarFilterGroup filterKey={key} values={values} activeValue={activeValue} />
                </div>
                <div {...stylex.props(styles.divider)} />
              </div>
            ))}
            <div {...stylex.props(styles.labelsSectionHeader)}>
              <Text weight="medium" variant="bodySmall" color="secondary">
                <Trans i18nKey="alerting.triage.labels-column-title">Labels</Trans>
              </Text>
              <FilterInput
                placeholder={t('alerting.triage.filter-labels-placeholder', 'Search labels')}
                value={labelFilter}
                onChange={setLabelFilter}
                aria-label={t('alerting.triage.filter-labels', 'Filter labels')}
                className={stylex.props(styles.labelFilterInput).className}
              />
            </div>
            <div {...stylex.props(styles.loadingBar)}>
              {isSubsequentLoad && <LoadingBar width={LABELS_COLUMN_WIDTH} />}
            </div>
            {isFirstLoad && <LabelsSkeleton />}
            {!isFirstLoad && labels.length > 0 && <AllLabelsContent allLabels={labels} labelFilter={labelFilter} />}
          </div>
        </ScrollContainer>
      )}
    </div>
  );
}

function StateFilter() {
  const sceneContext = useSceneContext();
  const activeState = useFilterValue('alertstate');
  const counts = useInstanceCounts();

  const toggle = (value: 'firing' | 'pending') => {
    if (activeState === value) {
      removeFilter(sceneContext, 'alertstate');
    } else {
      addOrReplaceFilter(sceneContext, 'alertstate', '=', value);
    }
  };

  return (
    <Stack direction="column" gap={0.5}>
      <button
        {...stylex.props(styles.stateButton, activeState === 'firing' && styles.stateButtonActive)}
        onClick={() => toggle('firing')}
      >
        <Icon name="exclamation-circle" size="sm" xstyle={styles.firingIcon} />
        <span {...stylex.props(styles.stateLabel)}>
          <Trans i18nKey="alerting.triage.state-firing">Firing</Trans>
        </span>
        {counts !== undefined && <span {...stylex.props(styles.stateCount)}>{counts.firing}</span>}
      </button>
      <button
        {...stylex.props(styles.stateButton, activeState === 'pending' && styles.stateButtonActive)}
        onClick={() => toggle('pending')}
      >
        <Icon name="circle" size="sm" xstyle={styles.pendingIcon} />
        <span {...stylex.props(styles.stateLabel)}>
          <Trans i18nKey="alerting.triage.state-pending">Pending</Trans>
        </span>
        {counts !== undefined && <span {...stylex.props(styles.stateCount)}>{counts.pending}</span>}
      </button>
    </Stack>
  );
}

type SidebarFilterKey = 'alertname' | 'grafana_folder' | 'service' | 'team' | 'namespace';
const SIDEBAR_FILTERS: Array<{ key: SidebarFilterKey; labelI18nKey: string; defaultLabel: string }> = [
  { key: 'alertname', labelI18nKey: 'alerting.triage.rule-name-filter-title', defaultLabel: 'Rule name' },
  { key: 'grafana_folder', labelI18nKey: 'alerting.triage.folder-filter-title', defaultLabel: 'Folder' },
  { key: 'service', labelI18nKey: 'alerting.triage.service-filter-title', defaultLabel: 'Service' },
  { key: 'team', labelI18nKey: 'alerting.triage.team-filter-title', defaultLabel: 'Team' },
  { key: 'namespace', labelI18nKey: 'alerting.triage.namespace-filter-title', defaultLabel: 'Namespace' },
];
const sidebarCollator = new Intl.Collator();
const MAX_VISIBLE_VALUES = 8;

type SidebarFilterValue = {
  value: string;
  firing: number;
  pending: number;
  total: number;
};

function SidebarFilterGroup({
  filterKey,
  values,
  activeValue,
}: {
  filterKey: SidebarFilterKey;
  values: SidebarFilterValue[];
  activeValue: string | undefined;
}) {
  const sceneContext = useSceneContext();

  return (
    <Stack direction="column" gap={0.25}>
      {values.slice(0, MAX_VISIBLE_VALUES).map((value) => {
        const isActive = activeValue === value.value;
        return (
          <button
            key={value.value}
            {...stylex.props(styles.stateButton, isActive && styles.stateButtonActive)}
            onClick={() => {
              if (isActive) {
                removeFilter(sceneContext, filterKey);
              } else {
                addOrReplaceFilter(sceneContext, filterKey, '=', value.value);
              }
            }}
          >
            <span {...stylex.props(styles.stateLabel)}>{value.value}</span>
            <span {...stylex.props(styles.stateCount)}>{value.firing + value.pending}</span>
          </button>
        );
      })}
    </Stack>
  );
}

function hasSeverityFilterValues(labels: LabelStats[]): boolean {
  return COMBINED_FILTER_LABEL_KEYS.severity.some((key) =>
    labels.some(
      (label) => label.key === key && label.values.some((value) => canonicalSeverity(value.value) !== undefined)
    )
  );
}

function getSidebarFilterValues(labels: LabelStats[], key: SidebarFilterKey): SidebarFilterValue[] {
  const keys = key === 'service' || key === 'namespace' ? COMBINED_FILTER_LABEL_KEYS[key] : ([key] as const);
  const merged = new Map<string, SidebarFilterValue>();

  for (const labelKey of keys) {
    const stat = labels.find((label) => label.key === labelKey);
    if (!stat) {
      continue;
    }
    for (const value of stat.values) {
      const existing = merged.get(value.value);
      if (!existing) {
        merged.set(value.value, {
          value: value.value,
          firing: value.firing,
          pending: value.pending,
          total: value.firing + value.pending,
        });
      } else {
        existing.firing += value.firing;
        existing.pending += value.pending;
        existing.total += value.firing + value.pending;
      }
    }
  }

  return Array.from(merged.values()).sort((a, b) => {
    if (b.total !== a.total) {
      return b.total - a.total;
    }
    return sidebarCollator.compare(a.value, b.value);
  });
}

/**
 * Returns the current firing/pending instance counts based on the active query filter,
 * or undefined while the data is still loading.
 */
export function useInstanceCounts(): { firing: number; pending: number } | undefined {
  const filter = useQueryFilter();

  // Strip alertstate from filter since the instance count query adds its own alertstate matchers
  const cleanFilter = cleanAlertStateFilter(filter);

  const instanceDataProvider = useQueryRunner({
    queries: [summaryInstanceCountQuery(cleanFilter)],
  });

  const { data } = instanceDataProvider.useState();
  const instanceFrame = data?.series?.at(0);

  if (!instanceDataProvider.isDataReadyToDisplay() || !instanceFrame) {
    return undefined;
  }

  return countInstances(instanceFrame);
}

const styles = stylex.create({
  column: {
    width: `${LABELS_COLUMN_WIDTH}px`,
    minWidth: `${LABELS_COLUMN_WIDTH}px`,
    maxWidth: `${LABELS_COLUMN_WIDTH}px`,
    marginRight: spacing['--gf-spacing-x2'],
    borderRightWidth: '1px',
    borderRightStyle: 'solid',
    borderRightColor: colors['--gf-colors-border-weak'],
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  columnCollapsed: {
    width: COLLAPSED_WIDTH,
    minWidth: COLLAPSED_WIDTH,
    maxWidth: COLLAPSED_WIDTH,
    borderRightStyle: 'none',
  },
  collapseButtonRow: {
    padding: spacing['--gf-spacing-x0-5'],
    flexShrink: 0,
  },
  collapseButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    padding: 0,
    backgroundColor: { default: 'transparent', ':hover': colors['--gf-colors-action-hover'] },
    backgroundImage: 'none',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-weak'],
    borderRadius: shape['--gf-shape-radius-default'],
    cursor: 'pointer',
    color: { default: colors['--gf-colors-text-secondary'], ':hover': colors['--gf-colors-text-primary'] },
    flexShrink: 0,
  },
  inner: {
    display: 'flex',
    flexDirection: 'column',
    paddingRight: spacing['--gf-spacing-x2'],
    paddingBottom: spacing['--gf-spacing-x1'],
  },
  section: {
    paddingTop: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: spacing['--gf-spacing-x1-5'],
    paddingRight: spacing['--gf-spacing-x1-5'],
    display: 'flex',
    flexDirection: 'column',
    gap: `calc(${spacing['--gf-spacing-grid-size']} * 0.75)`,
    flexShrink: 0,
  },
  divider: {
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: colors['--gf-colors-border-weak'],
    flexShrink: 0,
  },
  labelsSectionHeader: {
    paddingTop: spacing['--gf-spacing-x1'],
    paddingRight: 0,
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: spacing['--gf-spacing-x1-5'],
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: `calc(${spacing['--gf-spacing-grid-size']} * 0.75)`,
  },
  labelFilterInput: {
    width: '100%',
  },
  loadingBar: {
    // Keep a constant row height to avoid layout shifts during loading.
    height: 1,
    overflow: 'hidden',
  },
  skeletonList: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing['--gf-spacing-x1'],
    paddingTop: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: spacing['--gf-spacing-x1-5'],
    paddingRight: spacing['--gf-spacing-x1-5'],
  },
  skeletonRow: {
    display: 'flex',
    alignItems: 'center',
    gap: `calc(${spacing['--gf-spacing-grid-size']} * 0.75)`,
  },
  skeletonName: {
    flex: '1',
    minWidth: 0,
  },
  skeletonBadges: {
    display: 'flex',
    gap: spacing['--gf-spacing-x0-5'],
    marginLeft: 'auto',
    flexShrink: 0,
  },
  stateButton: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing['--gf-spacing-x1'],
    width: '100%',
    paddingTop: spacing['--gf-spacing-x0-5'],
    paddingBottom: spacing['--gf-spacing-x0-5'],
    paddingLeft: `calc(${spacing['--gf-spacing-grid-size']} * 0.75)`,
    paddingRight: `calc(${spacing['--gf-spacing-grid-size']} * 0.75)`,
    backgroundColor: { default: 'transparent', ':hover': colors['--gf-colors-action-hover'] },
    backgroundImage: 'none',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'transparent',
    borderRadius: shape['--gf-shape-radius-default'],
    cursor: 'pointer',
    color: colors['--gf-colors-text-secondary'],
    textAlign: 'left',
  },
  // Repeats the hover background: a later namespace replaces the whole property, conditions included.
  stateButtonActive: {
    backgroundColor: { default: colors['--gf-colors-action-selected'], ':hover': colors['--gf-colors-action-hover'] },
  },
  stateLabel: {
    color: colors['--gf-colors-text-secondary'],
    fontSize: typography['--gf-typography-body-small-font-size'],
  },
  firingIcon: {
    color: colors['--gf-colors-error-text'],
    flexShrink: 0,
  },
  pendingIcon: {
    color: colors['--gf-colors-warning-text'],
    flexShrink: 0,
  },
  stateCount: {
    marginLeft: 'auto',
    fontSize: typography['--gf-typography-body-small-font-size'],
    color: colors['--gf-colors-text-secondary'],
    fontVariantNumeric: 'tabular-nums',
  },
});
