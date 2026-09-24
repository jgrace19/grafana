import * as stylex from '@stylexjs/stylex';
import { type ComponentProps } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { ContactPointSelector, RoutingTreeSelector } from '@grafana/alerting/unstable';
import type { RoutingTree } from '@grafana/api-clients/rtkq/notifications.alerting/v1beta1';
import { Trans, t } from '@grafana/i18n';
import { config } from '@grafana/runtime';
import { Button, Combobox, Icon, Input, Label, MultiCombobox, Stack, Text, Tooltip, useTheme2 } from '@grafana/ui';
import { colors, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';
import { contextSrv } from 'app/core/services/context_srv';
import { AccessControlAction } from 'app/types/accessControl';
import { PromAlertingRuleState, PromRuleType } from 'app/types/unified-alerting-dto';

import { trackAlertRuleFilterEvent } from '../../Analytics';
import {
  useAlertingDataSourceOptions,
  useLabelOptions,
  useNamespaceAndGroupOptions,
} from '../../components/rules/Filter/useRuleFilterAutocomplete';
import { useRulesFilter } from '../../hooks/useFilteredRules';
import { RuleHealth, RuleSource, type RulesFilter } from '../../search/rulesSearchParser';

import { type AdvancedFilters } from './types';
import {
  advancedFiltersToRulesFilter,
  searchQueryToDefaultValues,
  usePluginsFilterStatus,
  usePortalContainer,
} from './utils';

import './RulesFilterSidebar.css';

const SIDEBAR_WIDTH = 250;

/**
 * Persistent filter sidebar for the alert rule list v2.
 * All filters apply immediately on change; rule name applies on blur or Enter.
 */
export function RulesFilterSidebar() {
  const { hasActiveFilters, clearAll, searchQuery, filterState } = useRulesFilter();

  return (
    <div {...stylex.props(styles.sidebar)}>
      <Stack direction="column" gap={0}>
        <Stack direction="row" justifyContent="flex-end">
          <Button size="sm" variant="primary" fill="text" onClick={clearAll} disabled={!hasActiveFilters}>
            <Trans i18nKey="alerting.rules-filter-sidebar.clear-filters">Clear filters</Trans>
          </Button>
        </Stack>
        {/* key remounts the form when the URL changes externally (top bar, clearAll, navigation)
            so defaultValues always reflect the current URL state — no sync effects needed */}
        <FilterSidebarForm key={searchQuery} filterState={filterState} />
      </Stack>
    </div>
  );
}

interface FilterSidebarFormProps {
  filterState: RulesFilter;
}

function FilterSidebarForm({ filterState }: FilterSidebarFormProps) {
  const theme = useTheme2();

  const { updateFilters } = useRulesFilter();
  const { pluginsFilterEnabled } = usePluginsFilterStatus();
  const canRenderContactPointSelector = contextSrv.hasPermission(AccessControlAction.AlertingReceiversRead);

  // Create portal container for combobox dropdowns
  const portalContainer = usePortalContainer(theme.zIndex.portal + 100);

  const defaults = searchQueryToDefaultValues(filterState);

  const { control, watch, register, setValue } = useForm<AdvancedFilters>({
    defaultValues: defaults,
  });

  const contactPointValue = watch('contactPoint');
  const policyValue = watch('policy');
  const isContactPointDisabled = Boolean(policyValue);
  const isPolicyDisabled = Boolean(contactPointValue);

  function applyFormValues(overrides: Partial<AdvancedFilters> = {}) {
    const formValues = watch();
    const ruleFilter = advancedFiltersToRulesFilter({ ...formValues, ...overrides }, filterState.freeFormWords);
    trackAlertRuleFilterEvent({ filterMethod: 'search-input', filter: ruleFilter, filterVariant: 'v2' });
    updateFilters(ruleFilter);
  }

  function handleContactPointChange(cp: { spec: { title: string } } | null) {
    const contactPoint = cp?.spec.title ?? null;
    setValue('contactPoint', contactPoint);
    if (contactPoint) {
      setValue('policy', null);
      applyFormValues({ contactPoint, policy: null });
    } else {
      applyFormValues({ contactPoint });
    }
  }

  function handlePolicyChange(tree: RoutingTree | null) {
    const policy = tree?.metadata.name ?? null;
    setValue('policy', policy);
    if (policy) {
      setValue('contactPoint', null);
      applyFormValues({ policy, contactPoint: null });
    } else {
      applyFormValues({ policy });
    }
  }

  const { namespaceOptions, groupOptions, namespacePlaceholder, groupPlaceholder } = useNamespaceAndGroupOptions();
  const { labelOptions } = useLabelOptions();
  const dataSourceOptions = useAlertingDataSourceOptions();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        applyFormValues();
      }}
    >
      <button type="submit" style={{ display: 'none' }} aria-hidden="true" />
      <Stack direction="column" gap={2}>
        <SidebarSection>
          <SidebarField label={<Trans i18nKey="alerting.search.property.rule-name">Rule name</Trans>}>
            <Input
              {...register('ruleName')}
              onBlur={() => applyFormValues()}
              placeholder={t('alerting.rule-list.filter-sidebar.rule-name-placeholder', 'Filter by name...')}
              data-testid="rule-name-filter-input"
            />
          </SidebarField>
          <SidebarField label={<Trans i18nKey="alerting.search.property.labels">Labels</Trans>}>
            <Controller
              name="labels"
              control={control}
              render={({ field }) => (
                <MultiCombobox
                  options={labelOptions}
                  value={field.value}
                  onChange={(selections) => {
                    const labels = selections.map((s) => s.value);
                    field.onChange(labels);
                    applyFormValues({ labels });
                  }}
                  placeholder={t('alerting.rules-filter.placeholder-labels', 'Select labels')}
                  portalContainer={portalContainer}
                />
              )}
            />
          </SidebarField>
          <SidebarField
            label={<Trans i18nKey="alerting.search.property.state">State</Trans>}
            labelId="filter-label-state"
          >
            <Controller
              name="ruleState"
              control={control}
              render={({ field }) => (
                <ToggleButtonGroup<AdvancedFilters['ruleState']>
                  aria-labelledby="filter-label-state"
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                    applyFormValues({ ruleState: value });
                  }}
                  options={[
                    { label: t('common.all', 'All'), value: '*' },
                    {
                      label: t('alerting.rules.state.firing', 'Firing'),
                      value: PromAlertingRuleState.Firing,
                      icon: 'exclamation-circle',
                      color: 'error',
                    },
                    {
                      label: t('alerting.rules.state.normal', 'Normal'),
                      value: PromAlertingRuleState.Inactive,
                      icon: 'check-circle',
                      color: 'success',
                    },
                    {
                      label: t('alerting.rules.state.pending', 'Pending'),
                      value: PromAlertingRuleState.Pending,
                      icon: 'circle',
                      color: 'warning',
                    },
                    {
                      label: t('alerting.rules.state.recovering', 'Recovering'),
                      value: PromAlertingRuleState.Recovering,
                      icon: 'arrow-up',
                      color: 'info',
                    },
                  ]}
                />
              )}
            />
          </SidebarField>
        </SidebarSection>

        <div {...stylex.props(styles.divider)} />

        <SidebarSection>
          <SidebarField label={<Trans i18nKey="alerting.search.property.namespace">Folder / Namespace</Trans>}>
            <Controller
              name="namespace"
              control={control}
              render={({ field }) => (
                <Combobox<string>
                  placeholder={namespacePlaceholder}
                  options={namespaceOptions}
                  onChange={(option) => {
                    if (!option?.infoOption) {
                      const namespace = option?.value ?? null;
                      field.onChange(namespace);
                      applyFormValues({ namespace });
                    }
                  }}
                  value={field.value}
                  isClearable
                  portalContainer={portalContainer}
                />
              )}
            />
          </SidebarField>
          <SidebarField label={<Trans i18nKey="alerting.search.property.evaluation-group">Evaluation group</Trans>}>
            <Controller
              name="groupName"
              control={control}
              render={({ field }) => (
                <Combobox<string>
                  placeholder={groupPlaceholder}
                  options={groupOptions}
                  onChange={(option) => {
                    if (!option?.infoOption) {
                      const groupName = option?.value ?? null;
                      field.onChange(groupName);
                      applyFormValues({ groupName });
                    }
                  }}
                  value={field.value}
                  isClearable
                  portalContainer={portalContainer}
                />
              )}
            />
          </SidebarField>
        </SidebarSection>

        <div {...stylex.props(styles.divider)} />

        <SidebarSection>
          <SidebarField
            label={<Trans i18nKey="alerting.search.property.rule-source">Rule source</Trans>}
            labelId="filter-label-rule-source"
          >
            <Controller
              name="ruleSource"
              control={control}
              render={({ field }) => (
                <ToggleButtonGroup<AdvancedFilters['ruleSource']>
                  aria-labelledby="filter-label-rule-source"
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                    applyFormValues({ ruleSource: value });
                  }}
                  options={[
                    { label: t('common.all', 'All'), value: null },
                    {
                      label: t('alerting.rules-filter.rule-source.grafana', 'Grafana managed'),
                      value: RuleSource.Grafana,
                    },
                    {
                      label: t('alerting.rules-filter.rule-source.datasource', 'Data source managed'),
                      value: RuleSource.DataSource,
                    },
                  ]}
                />
              )}
            />
          </SidebarField>

          <SidebarField
            label={
              <Stack gap={0.5} alignItems="center">
                <span>
                  <Trans i18nKey="alerting.search.property.data-source">Data source</Trans>
                </span>
                <Tooltip
                  content={
                    <div>
                      <p>
                        <Trans i18nKey="alerting.rules-filter.configured-alert-rules">
                          Data sources containing configured alert rules are Mimir or Loki data sources where alert
                          rules are stored and evaluated in the data source itself.
                        </Trans>
                      </p>
                      <p>
                        <Trans i18nKey="alerting.rules-filter.manage-alerts">
                          In these data sources, you can select Manage alerts via Alerting UI to be able to manage these
                          alert rules in the Grafana UI as well as in the data source where they were configured.
                        </Trans>
                      </p>
                    </div>
                  }
                >
                  <Icon
                    name="info-circle"
                    size="sm"
                    title={t(
                      'alerting.rules-filter.data-source-picker-inline-help-title-search-by-data-sources-help',
                      'Search by data sources help'
                    )}
                  />
                </Tooltip>
              </Stack>
            }
          >
            <Controller
              name="dataSourceNames"
              control={control}
              render={({ field }) => (
                <MultiCombobox
                  options={dataSourceOptions}
                  value={field.value}
                  onChange={(selections) => {
                    const dataSourceNames = selections.map((s) => s.value);
                    field.onChange(dataSourceNames);
                    applyFormValues({ dataSourceNames });
                  }}
                  placeholder={t('alerting.rules-filter.placeholder-data-sources', 'Select data sources')}
                  portalContainer={portalContainer}
                />
              )}
            />
          </SidebarField>
        </SidebarSection>

        <div {...stylex.props(styles.divider)} />

        {(canRenderContactPointSelector || config.featureToggles.alertingMultiplePolicies) && (
          <>
            <SidebarSection>
              {canRenderContactPointSelector && (
                <SidebarField
                  label={
                    <Stack gap={0.5} alignItems="center">
                      <span>
                        <Trans i18nKey="alerting.contactPointFilter.label">Contact point</Trans>
                      </span>
                      <Tooltip
                        content={
                          <Trans i18nKey="alerting.rules-filter.contact-point-tooltip">
                            Filters alert rules which route directly to the selected contact point. Alert rules routed
                            to notification policies will not be displayed.
                          </Trans>
                        }
                      >
                        <Icon
                          name="info-circle"
                          size="sm"
                          title={t('alerting.rules-filter.contact-point-tooltip-title', 'Contact point filter help')}
                        />
                      </Tooltip>
                    </Stack>
                  }
                >
                  <Controller
                    name="contactPoint"
                    control={control}
                    render={({ field }) => {
                      const selector = (
                        <ContactPointSelector
                          placeholder={t('alerting.rules-filter.placeholder-contact-point', 'Select contact point')}
                          value={field.value}
                          isClearable
                          disabled={isContactPointDisabled}
                          onChange={handleContactPointChange}
                          portalContainer={portalContainer}
                        />
                      );

                      if (isContactPointDisabled) {
                        return (
                          <Tooltip
                            content={t(
                              'alerting.rules-filter.contact-point-disabled-tooltip',
                              'Contact point filtering is not available while a notification policy filter is active.'
                            )}
                            placement="top"
                          >
                            <div>{selector}</div>
                          </Tooltip>
                        );
                      }

                      return selector;
                    }}
                  />
                </SidebarField>
              )}
              {config.featureToggles.alertingMultiplePolicies && (
                <SidebarField
                  label={
                    <Stack gap={0.5} alignItems="center">
                      <span>
                        <Trans i18nKey="alerting.policyFilter.label">Notification policy</Trans>
                      </span>
                      <Tooltip
                        content={
                          <Trans i18nKey="alerting.rules-filter.policy-tooltip">
                            Filters alert rules which route to the selected notification policy tree. Alert rules using
                            direct contact point routing will not be displayed.
                          </Trans>
                        }
                      >
                        <Icon
                          name="info-circle"
                          size="sm"
                          title={t('alerting.rules-filter.policy-tooltip-title', 'Notification policy filter help')}
                        />
                      </Tooltip>
                    </Stack>
                  }
                >
                  <Controller
                    name="policy"
                    control={control}
                    render={({ field }) => {
                      const selector = (
                        <RoutingTreeSelector
                          placeholder={t('alerting.rules-filter.placeholder-policy', 'Select policy')}
                          value={field.value ?? undefined}
                          isClearable
                          disabled={isPolicyDisabled}
                          onChange={handlePolicyChange}
                          portalContainer={portalContainer}
                        />
                      );

                      if (isPolicyDisabled) {
                        return (
                          <Tooltip
                            content={t(
                              'alerting.rules-filter.policy-disabled-tooltip',
                              'Notification policy filtering is not available while a contact point filter is active.'
                            )}
                            placement="top"
                          >
                            <div>{selector}</div>
                          </Tooltip>
                        );
                      }

                      return selector;
                    }}
                  />
                </SidebarField>
              )}
            </SidebarSection>
            <div {...stylex.props(styles.divider)} />
          </>
        )}

        <SidebarSection>
          <SidebarField
            label={<Trans i18nKey="alerting.search.property.rule-type">Type</Trans>}
            labelId="filter-label-rule-type"
          >
            <Controller
              name="ruleType"
              control={control}
              render={({ field }) => (
                <ToggleButtonGroup<AdvancedFilters['ruleType']>
                  aria-labelledby="filter-label-rule-type"
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                    applyFormValues();
                  }}
                  options={[
                    { label: t('common.all', 'All'), value: '*' },
                    { label: t('alerting.rules.type.alert', 'Alert rule'), value: PromRuleType.Alerting },
                    { label: t('alerting.rules.type.recording', 'Recording rule'), value: PromRuleType.Recording },
                  ]}
                />
              )}
            />
          </SidebarField>

          <SidebarField
            label={<Trans i18nKey="alerting.search.property.rule-health">Health</Trans>}
            labelId="filter-label-rule-health"
          >
            <Controller
              name="ruleHealth"
              control={control}
              render={({ field }) => (
                <ToggleButtonGroup<AdvancedFilters['ruleHealth']>
                  aria-labelledby="filter-label-rule-health"
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                    applyFormValues();
                  }}
                  options={[
                    { label: t('common.all', 'All'), value: '*' },
                    { label: t('alerting.rules.health.ok', 'OK'), value: RuleHealth.Ok },
                    { label: t('alerting.rules.health.no-data', 'No data'), value: RuleHealth.NoData },
                    { label: t('alerting.rules.health.error', 'Error'), value: RuleHealth.Error },
                  ]}
                />
              )}
            />
          </SidebarField>
        </SidebarSection>

        {pluginsFilterEnabled && (
          <>
            <div {...stylex.props(styles.divider)} />
            <SidebarSection>
              <SidebarField
                label={<Trans i18nKey="alerting.rules-filter.plugin-rules">Plugin rules</Trans>}
                labelId="filter-label-plugins"
              >
                <Controller
                  name="plugins"
                  control={control}
                  render={({ field }) => (
                    <ToggleButtonGroup<AdvancedFilters['plugins']>
                      aria-labelledby="filter-label-plugins"
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        applyFormValues();
                      }}
                      options={[
                        { label: t('alerting.rules-filter.label.show', 'Show'), value: 'show' },
                        { label: t('alerting.rules-filter.label.hide', 'Hide'), value: 'hide' },
                      ]}
                    />
                  )}
                />
              </SidebarField>
            </SidebarSection>
          </>
        )}
      </Stack>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Section & field layout helpers
// ---------------------------------------------------------------------------

function SidebarSection({ children }: { children: React.ReactNode }) {
  return (
    <div {...stylex.props(styles.section)}>
      <Stack direction="column" gap={1.5}>
        {children}
      </Stack>
    </div>
  );
}

function SidebarField({
  label,
  children,
  labelId,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
  labelId?: string;
}) {
  return (
    <div {...stylex.props(styles.field)}>
      <Label id={labelId} className="gf-rules-filter-field-label">
        {label}
      </Label>
      <div {...stylex.props(styles.fieldValue)}>{children}</div>
    </div>
  );
}

interface ToggleOption<T> {
  label: string;
  value: T;
  icon?: ComponentProps<typeof Icon>['name'];
  color?: ComponentProps<typeof Text>['color'];
}

interface ToggleButtonGroupProps<T> {
  options: Array<ToggleOption<T>>;
  value: T;
  onChange: (value: T) => void;
  'aria-labelledby': string;
}

function ToggleButtonGroup<T>({ options, value, onChange, 'aria-labelledby': labelledBy }: ToggleButtonGroupProps<T>) {
  return (
    <div role="radiogroup" aria-labelledby={labelledBy}>
      <Stack direction="column" gap={0.5}>
        {options.map((opt) => {
          const isActive = opt.value === value;
          return (
            <button
              key={String(opt.value)}
              type="button"
              role="radio"
              aria-checked={isActive}
              {...stylex.props(styles.toggleButton, isActive && styles.toggleButtonActive)}
              onClick={() => onChange(opt.value)}
            >
              {opt.icon && (
                <Text color={opt.color}>
                  <Icon name={opt.icon} size="sm" xstyle={styles.toggleButtonIcon} aria-hidden="true" />
                </Text>
              )}
              <span {...stylex.props(styles.toggleButtonLabel)}>{opt.label}</span>
            </button>
          );
        })}
      </Stack>
    </div>
  );
}

const styles = stylex.create({
  sidebar: {
    width: SIDEBAR_WIDTH,
    borderRightWidth: '1px',
    borderRightStyle: 'solid',
    borderRightColor: colors['--gf-colors-border-weak'],
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    paddingRight: spacing['--gf-spacing-x2'],
    paddingBottom: spacing['--gf-spacing-x2'],
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing['--gf-spacing-x1'],
  },
  divider: {
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: colors['--gf-colors-border-weak'],
    flexShrink: 0,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing['--gf-spacing-x0-5'],
  },
  fieldValue: {
    position: 'relative',
  },
  toggleButton: {
    display: 'flex',
    alignItems: 'center',
    gap: `calc(${spacing['--gf-spacing-grid-size']} * 0.75)`,
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
    color: { default: colors['--gf-colors-text-secondary'], ':hover': colors['--gf-colors-text-primary'] },
    textAlign: 'left',
    fontSize: typography['--gf-typography-body-small-font-size'],
  },
  // Repeats the hover state: a later namespace replaces the whole property, conditions included.
  toggleButtonActive: {
    backgroundColor: { default: colors['--gf-colors-action-selected'], ':hover': colors['--gf-colors-action-hover'] },
    color: colors['--gf-colors-text-primary'],
  },
  toggleButtonIcon: {
    flexShrink: 0,
  },
  toggleButtonLabel: {
    fontSize: typography['--gf-typography-body-small-font-size'],
  },
});
