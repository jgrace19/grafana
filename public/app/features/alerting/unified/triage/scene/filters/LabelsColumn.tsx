import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { labelsColumnStyles } from './LabelsColumn.stylex';
import { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useToggle } from 'react-use';

import { Trans, t } from '@grafana/i18n';
import { useQueryRunner, useSceneContext } from '@grafana/scenes-react';
import { Button, FilterInput, Icon, LoadingBar, ScrollContainer, Stack, Text, Tooltip } from '@grafana/ui';

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
    <div {...stylex.props(labelsColumnStyles.skeletonList)}>
      {Array.from({ length: SKELETON_ROW_COUNT }, (_, i) => (
        <div key={i} {...stylex.props(labelsColumnStyles.skeletonRow)}>
          <Skeleton width={16} height={16} />
          <span {...stylex.props(labelsColumnStyles.skeletonName)}>
            <Skeleton width="100%" height={16} />
          </span>
          <div {...stylex.props(labelsColumnStyles.skeletonBadges)}>
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
    <div className={cx(labelsColumnStyles.column, !open && labelsColumnStyles.columnCollapsed)}>
      <div {...stylex.props(labelsColumnStyles.collapseButtonRow)}>
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
              {...stylex.props(labelsColumnStyles.collapseButton)}
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
          <div {...stylex.props(labelsColumnStyles.inner)}>
            <div {...stylex.props(labelsColumnStyles.section)}>
              <Text weight="medium" variant="bodySmall" color="secondary">
                <Trans i18nKey="alerting.triage.state-filter-title">State</Trans>
              </Text>
              <StateFilter />
            </div>
            <div {...stylex.props(labelsColumnStyles.divider)} />
            {showSeverityFilter && (
              <>
                <div {...stylex.props(labelsColumnStyles.section)}>
                  <Text weight="medium" variant="bodySmall" color="secondary">
                    <Trans i18nKey="alerting.triage.severity-filter-title">Severity</Trans>
                  </Text>
                  <SeverityFilter labels={labels} />
                </div>
                <div {...stylex.props(labelsColumnStyles.divider)} />
              </>
            )}
            {visibleSidebarFilters.map(({ key, labelI18nKey, defaultLabel, values, activeValue }) => (
              <div key={key}>
                <div {...stylex.props(labelsColumnStyles.section)}>
                  <Text weight="medium" variant="bodySmall" color="secondary">
                    {t(labelI18nKey, defaultLabel)}
                  </Text>
                  <SidebarFilterGroup filterKey={key} values={values} activeValue={activeValue} />
                </div>
                <div {...stylex.props(labelsColumnStyles.divider)} />
              </div>
            ))}
            <div {...stylex.props(labelsColumnStyles.labelsSectionHeader)}>
              <Text weight="medium" variant="bodySmall" color="secondary">
                <Trans i18nKey="alerting.triage.labels-column-title">Labels</Trans>
              </Text>
              <FilterInput
                placeholder={t('alerting.triage.filter-labels-placeholder', 'Search labels')}
                value={labelFilter}
                onChange={setLabelFilter}
                aria-label={t('alerting.triage.filter-labels', 'Filter labels')}
                {...stylex.props(labelsColumnStyles.labelFilterInput)}
              />
            </div>
            <div {...stylex.props(labelsColumnStyles.loadingBar)}>{isSubsequentLoad && <LoadingBar width={LABELS_COLUMN_WIDTH} />}</div>
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
        className={cx(labelsColumnStyles.stateButton, activeState === 'firing' && labelsColumnStyles.stateButtonActive)}
        onClick={() => toggle('firing')}
      >
        <Icon name="exclamation-circle" size="sm" {...stylex.props(labelsColumnStyles.firingIcon)} />
        <span {...stylex.props(labelsColumnStyles.stateLabel)}>
          <Trans i18nKey="alerting.triage.state-firing">Firing</Trans>
        </span>
        {counts !== undefined && <span {...stylex.props(labelsColumnStyles.stateCount)}>{counts.firing}</span>}
      </button>
      <button
        className={cx(labelsColumnStyles.stateButton, activeState === 'pending' && labelsColumnStyles.stateButtonActive)}
        onClick={() => toggle('pending')}
      >
        <Icon name="circle" size="sm" {...stylex.props(labelsColumnStyles.pendingIcon)} />
        <span {...stylex.props(labelsColumnStyles.stateLabel)}>
          <Trans i18nKey="alerting.triage.state-pending">Pending</Trans>
        </span>
        {counts !== undefined && <span {...stylex.props(labelsColumnStyles.stateCount)}>{counts.pending}</span>}
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
            className={cx(labelsColumnStyles.stateButton, isActive && labelsColumnStyles.stateButtonActive)}
            onClick={() => {
              if (isActive) {
                removeFilter(sceneContext, filterKey);
              } else {
                addOrReplaceFilter(sceneContext, filterKey, '=', value.value);
              }
            }}
          >
            <span {...stylex.props(labelsColumnStyles.stateLabel)}>{value.value}</span>
            <span {...stylex.props(labelsColumnStyles.stateCount)}>{value.firing + value.pending}</span>
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

