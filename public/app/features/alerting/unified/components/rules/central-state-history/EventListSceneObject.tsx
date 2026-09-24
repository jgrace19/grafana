import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import { type ReactElement, useState } from 'react';
import { useLocation } from 'react-router-dom-v5-compat';
import { useMeasure } from 'react-use';

import { AlertLabels } from '@grafana/alerting/unstable';
import { type IconName, type TimeRange } from '@grafana/data';
import { Trans, t } from '@grafana/i18n';
import {
  CustomVariable,
  type SceneComponentProps,
  SceneObjectBase,
  type SceneObjectState,
  TextBoxVariable,
  VariableDependencyConfig,
  type VariableValue,
  sceneGraph,
} from '@grafana/scenes';
import { Alert, Icon, LoadingBar, Pagination, Stack, Text, Tooltip, withErrorBoundary } from '@grafana/ui';
import { colors, components, spacing } from '@grafana/ui/stylex/tokens.stylex';
import {
  type GrafanaAlertStateWithReason,
  isAlertStateWithReason,
  isGrafanaAlertState,
  mapStateWithReasonToBaseState,
  mapStateWithReasonToReason,
} from 'app/types/unified-alerting-dto';

import { trackUseCentralHistoryFilterByClicking, trackUseCentralHistoryMaxEventsReached } from '../../../Analytics';
import { stateHistoryApi } from '../../../api/stateHistoryApi';
import { AITriageButtonComponent } from '../../../enterprise-components/AI/AIGenTriageButton/addAITriageButton';
import { usePagination } from '../../../hooks/usePagination';
import { useSlowQuery } from '../../../hooks/useSlowQuery';
import { combineMatcherStrings } from '../../../utils/alertmanager';
import { GRAFANA_RULES_SOURCE_NAME } from '../../../utils/datasource';
import { createRelativeUrl } from '../../../utils/url';
import { CollapseToggle } from '../../CollapseToggle';
import { type LogRecord } from '../state-history/common';

import { LABELS_FILTER, STATE_FILTER_FROM, STATE_FILTER_TO } from './CentralAlertHistoryScene';
import { EventDetails } from './EventDetails';
import { HistoryErrorMessage } from './HistoryErrorMessage';
import { useRuleHistoryRecords } from './useRuleHistoryRecords';
import { toMatchersParam } from './utils';

export const LIMIT_EVENTS = 5000; // limit is hard-capped at 5000 at the BE level.
const PAGE_SIZE = 100;

/**
 *
 * This component displays a list of history events.
 * It fetches the events from the history api and displays them in a list.
 * The list is filtered by the labels in the filter variable and by the time range variable in the scene graph.
 */
interface HistoryEventsListProps {
  timeRange: TimeRange;
  valueInLabelFilter: VariableValue;
  valueInStateToFilter: VariableValue;
  valueInStateFromFilter: VariableValue;
  addFilter: (key: string, value: string, type: FilterType) => void;
  hideAlertRuleColumn?: boolean;
}
export const HistoryEventsList = ({
  timeRange,
  valueInLabelFilter,
  valueInStateToFilter,
  valueInStateFromFilter,
  addFilter,
  hideAlertRuleColumn,
}: HistoryEventsListProps) => {
  const from = timeRange?.from.unix();
  const to = timeRange?.to.unix();

  const stateTo = valueInStateToFilter.toString();
  const stateFrom = valueInStateFromFilter.toString();

  const {
    data: stateHistory,
    isLoading,
    isError,
    error,
  } = stateHistoryApi.endpoints.getRuleHistory.useQuery({
    from: from,
    to: to,
    limit: LIMIT_EVENTS,
    matchers: toMatchersParam(valueInLabelFilter.toString()),
    current: stateTo !== 'all' ? stateTo : undefined,
    previous: stateFrom !== 'all' ? stateFrom : undefined,
  });

  const isSlowQuery = useSlowQuery(isLoading, { threshold: 5_000 });

  const { historyRecords: historyRecordsNotSorted } = useRuleHistoryRecords(stateHistory, {
    labels: valueInLabelFilter.toString(),
  });

  const historyRecords = historyRecordsNotSorted.sort((a, b) => b.timestamp - a.timestamp);

  if (isError) {
    return <HistoryErrorMessage error={error} />;
  }

  const maximumEventsReached = !isLoading && stateHistory?.data?.values?.[0]?.length === LIMIT_EVENTS;
  if (maximumEventsReached) {
    trackUseCentralHistoryMaxEventsReached({ from, to });
  }

  return (
    <Stack direction="column" gap={0.5}>
      {maximumEventsReached && (
        <Alert
          severity="warning"
          title={t('alerting.central-alert-history.too-many-events.title', 'Unable to display all events')}
        >
          {t(
            'alerting.central-alert-history.too-many-events.text',
            'The selected time period has too many events to display. Displaying the latest 5000 events. Try using a shorter time period.'
          )}
        </Alert>
      )}
      {isSlowQuery && (
        <Alert
          severity="warning"
          title={t('alerting.central-alert-history.slow-query.title', 'Query is taking longer than expected')}
        >
          {t(
            'alerting.central-alert-history.slow-query.text',
            'This query is taking longer than expected. This can happen when a regex or negation label filter matches too many alert instances. Consider using a shorter time range or a more specific filter.'
          )}
        </Alert>
      )}
      <LoadingIndicator visible={isLoading} />
      <HistoryLogEvents
        logRecords={historyRecords}
        addFilter={addFilter}
        timeRange={timeRange}
        hideAlertRuleColumn={hideAlertRuleColumn}
      />
    </Stack>
  );
};

// todo: this function has been copied from RuleList.v2.tsx, should be moved to a shared location
const LoadingIndicator = ({ visible = false }) => {
  const [measureRef, { width }] = useMeasure<HTMLDivElement>();
  return <div ref={measureRef}>{visible && <LoadingBar width={width} data-testid="loading-bar" />}</div>;
};

interface HistoryLogEventsProps {
  logRecords: LogRecord[];
  addFilter: (key: string, value: string, type: FilterType) => void;
  timeRange: TimeRange;
  hideAlertRuleColumn?: boolean;
}
function HistoryLogEvents({ logRecords, addFilter, timeRange, hideAlertRuleColumn }: HistoryLogEventsProps) {
  const { page, pageItems, numberOfPages, onPageChange } = usePagination(logRecords, 1, PAGE_SIZE);
  return (
    <Stack direction="column" gap={0}>
      <div {...stylex.props(styles.headerContainer)}>
        <ListHeader hideAlertRuleColumn={hideAlertRuleColumn} />

        <div {...stylex.props(styles.triageButtonContainer)}>
          <AITriageButtonComponent logRecords={logRecords} timeRange={timeRange} />
        </div>
      </div>
      <ul>
        {pageItems.map((record) => {
          return (
            <EventRow
              key={record.timestamp + (record.line.fingerprint ?? '')}
              record={record}
              addFilter={addFilter}
              timeRange={timeRange}
              hideAlertRuleColumn={hideAlertRuleColumn}
            />
          );
        })}
      </ul>
      {/* This paginations improves the performance considerably , making the page load faster */}
      <Pagination currentPage={page} numberOfPages={numberOfPages} onNavigate={onPageChange} hideWhenSinglePage />
    </Stack>
  );
}

function ListHeader({ hideAlertRuleColumn }: { hideAlertRuleColumn?: boolean }) {
  return (
    <div {...stylex.props(styles.mainHeader)}>
      <div {...stylex.props(styles.timeCol)}>
        <Text variant="body">
          <Trans i18nKey="alerting.central-alert-history.details.header.timestamp">Timestamp</Trans>
        </Text>
      </div>
      <div {...stylex.props(styles.transitionCol)}>
        <Text variant="body">
          <Trans i18nKey="alerting.central-alert-history.details.header.state">State</Trans>
        </Text>
      </div>
      {!hideAlertRuleColumn && (
        <div {...stylex.props(styles.alertNameCol)}>
          <Text variant="body">
            <Trans i18nKey="alerting.central-alert-history.details.header.alert-rule">Alert rule</Trans>
          </Text>
        </div>
      )}
      <div {...stylex.props(styles.labelsCol)}>
        <Text variant="body">
          <Trans i18nKey="alerting.central-alert-history.details.header.instance">Instance</Trans>
        </Text>
      </div>
    </div>
  );
}

interface EventRowProps {
  record: LogRecord;
  addFilter: (key: string, value: string, type: FilterType) => void;
  timeRange: TimeRange;
  hideAlertRuleColumn?: boolean;
}
function EventRow({ record, addFilter, timeRange, hideAlertRuleColumn }: EventRowProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  function onLabelClick([value, label]: [string | undefined, string | undefined]) {
    if (label && value) {
      addFilter(label, value, 'label');
    }
  }

  return (
    <Stack direction="column" gap={0}>
      <div {...stylex.props(styles.header, isCollapsed && styles.collapsedHeader)} data-testid="event-row-header">
        <CollapseToggle size="sm" style={collapseToggleStyle} isCollapsed={isCollapsed} onToggle={setIsCollapsed} />
        <Stack gap={0.5} direction={'row'} alignItems={'center'}>
          <div {...stylex.props(styles.timeCol)}>
            <Timestamp time={record.timestamp} />
          </div>
          <div {...stylex.props(styles.transitionCol)}>
            <EventTransition previous={record.line.previous} current={record.line.current} addFilter={addFilter} />
          </div>
          {!hideAlertRuleColumn && (
            <div {...stylex.props(styles.alertNameCol)}>
              {record.line.labels ? <AlertRuleName labels={record.line.labels} ruleUID={record.line.ruleUID} /> : null}
            </div>
          )}
          <div {...stylex.props(styles.labelsCol)}>
            <AlertLabels labels={record.line.labels ?? {}} size="xs" onClick={onLabelClick} />
          </div>
        </Stack>
      </div>
      {!isCollapsed && (
        <div {...stylex.props(styles.expandedRow)}>
          <EventDetails record={record} addFilter={addFilter} timeRange={timeRange} />
        </div>
      )}
    </Stack>
  );
}

interface AlertRuleNameProps {
  labels: Record<string, string>;
  ruleUID?: string;
}
function AlertRuleName({ labels, ruleUID }: AlertRuleNameProps) {
  const { pathname, search } = useLocation();
  const returnTo = `${pathname}${search}`;
  const alertRuleName = labels.alertname;
  if (!ruleUID) {
    return (
      <Text>
        <Trans i18nKey="alerting.central-alert-history.details.unknown-rule">Unknown</Trans>
      </Text>
    );
  }
  const ruleViewUrl = createRelativeUrl(`/alerting/${GRAFANA_RULES_SOURCE_NAME}/${ruleUID}/view`, {
    tab: 'history',
    returnTo,
  });
  return (
    <Tooltip content={alertRuleName ?? ''}>
      <a href={ruleViewUrl} {...stylex.props(styles.alertName)}>
        {alertRuleName}
      </a>
    </Tooltip>
  );
}

interface EventTransitionProps {
  previous: GrafanaAlertStateWithReason;
  current: GrafanaAlertStateWithReason;
  addFilter: (key: string, value: string, type: FilterType) => void;
}
function EventTransition({ previous, current, addFilter }: EventTransitionProps) {
  return (
    <Stack gap={0.5} direction={'row'}>
      <EventState state={previous} addFilter={addFilter} type="from" />
      <Icon name="arrow-right" size="lg" />
      <EventState state={current} addFilter={addFilter} type="to" />
    </Stack>
  );
}

interface StateIconProps {
  iconName: IconName;
  iconColor?: StyleXStyles;
  tooltipContent: string;
  labelText: ReactElement;
  showLabel: boolean;
}
const StateIcon = ({ iconName, iconColor, tooltipContent, labelText, showLabel }: StateIconProps) => (
  <Tooltip content={tooltipContent} placement="top">
    <Stack gap={0.5} direction={'row'} alignItems="center">
      <Icon name={iconName} size="md" xstyle={iconColor} />
      {showLabel && (
        <Text variant="body" weight="light">
          {labelText}
        </Text>
      )}
    </Stack>
  </Tooltip>
);

interface EventStateProps {
  state: GrafanaAlertStateWithReason;
  showLabel?: boolean;
  addFilter: (key: string, value: string, type: FilterType) => void;
  type: 'from' | 'to';
}
export function EventState({ state, showLabel = false, addFilter, type }: EventStateProps) {
  const toolTip = t('alerting.central-alert-history.details.no-recognized-state', 'No recognized state');
  if (!isGrafanaAlertState(state) && !isAlertStateWithReason(state)) {
    return (
      <StateIcon
        iconName="exclamation-triangle"
        tooltipContent={toolTip}
        labelText={<Trans i18nKey="alerting.central-alert-history.details.unknown-event-state">Unknown</Trans>}
        showLabel={showLabel}
        iconColor={styles.warningColor}
      />
    );
  }
  const baseState = mapStateWithReasonToBaseState(state);
  const reason = mapStateWithReasonToReason(state);
  interface StateConfig {
    iconName: IconName;
    iconColor: StyleXStyles;
    tooltipContent: string;
    labelText: ReactElement;
  }
  interface StateConfigMap {
    [key: string]: StateConfig;
  }
  const stateConfig: StateConfigMap = {
    Normal: {
      iconName: 'check-circle',
      iconColor: Boolean(reason) ? styles.warningColor : styles.normalColor,
      tooltipContent: Boolean(reason) ? `Normal (${reason})` : 'Normal',
      labelText: <Trans i18nKey="alerting.central-alert-history.details.state.normal">Normal</Trans>,
    },
    Alerting: {
      iconName: 'exclamation-circle',
      iconColor: styles.alertingColor,
      tooltipContent: 'Alerting',
      labelText: <Trans i18nKey="alerting.central-alert-history.details.state.alerting">Alerting</Trans>,
    },
    NoData: {
      iconName: 'exclamation-triangle',
      iconColor: styles.warningColor,
      tooltipContent: 'Insufficient data',
      labelText: <Trans i18nKey="alerting.central-alert-history.details.state.no-data">No data</Trans>,
    },
    Error: {
      iconName: 'exclamation-circle',
      tooltipContent: 'Error',
      iconColor: styles.warningColor,
      labelText: <Trans i18nKey="alerting.central-alert-history.details.state.error">Error</Trans>,
    },
    Pending: {
      iconName: 'circle',
      iconColor: styles.warningColor,
      tooltipContent: Boolean(reason) ? `Pending (${reason})` : 'Pending',
      labelText: <Trans i18nKey="alerting.central-alert-history.details.state.pending">Pending</Trans>,
    },
    Recovering: {
      iconName: 'circle',
      iconColor: styles.warningColor,
      tooltipContent: Boolean(reason) ? `Recovering (${reason})` : 'Recovering',
      labelText: <Trans i18nKey="alerting.central-alert-history.details.state.recovering">Recovering</Trans>,
    },
  };
  function onStateClick() {
    addFilter('state', baseState, type === 'from' ? 'stateFrom' : 'stateTo');
  }

  const config = stateConfig[baseState] || { iconName: 'exclamation-triangle', tooltipContent: 'Unknown State' };
  return (
    <div
      onClick={onStateClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onStateClick();
        }
      }}
      {...stylex.props(styles.state)}
      role="button"
      tabIndex={0}
    >
      <StateIcon {...config} showLabel={showLabel} />
    </div>
  );
}

interface TimestampProps {
  time: number; // epoch timestamp
}

const Timestamp = ({ time }: TimestampProps) => {
  const dateTime = new Date(time);
  const formattedDate = dateTime.toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  return (
    <Text variant="body" weight="light">
      {formattedDate}
    </Text>
  );
};

export default withErrorBoundary(HistoryEventsList, { style: 'page' });

const styles = stylex.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing['--gf-spacing-x1'],
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: 0,
    flexWrap: 'nowrap',
    backgroundColor: {
      default: null,
      ':hover': components['--gf-components-table-row-hover-background'],
    },
  },
  collapsedHeader: {
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors['--gf-colors-border-weak'],
  },
  normalColor: {
    fill: colors['--gf-colors-success-text'],
  },
  warningColor: {
    fill: colors['--gf-colors-warning-text'],
  },
  alertingColor: {
    fill: colors['--gf-colors-error-text'],
  },
  timeCol: {
    width: '150px',
  },
  transitionCol: {
    width: '80px',
  },
  alertNameCol: {
    width: '300px',
  },
  labelsCol: {
    display: 'flex',
    overflow: 'hidden',
    alignItems: 'center',
    paddingRight: spacing['--gf-spacing-x2'],
    flex: '1',
  },
  alertName: {
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'block',
    color: colors['--gf-colors-text-link'],
  },
  expandedRow: {
    padding: spacing['--gf-spacing-x2'],
    marginLeft: spacing['--gf-spacing-x2'],
    borderLeftWidth: '1px',
    borderLeftStyle: 'solid',
    borderLeftColor: colors['--gf-colors-border-weak'],
  },
  state: {
    opacity: { default: null, ':hover': 0.8 },
    cursor: { default: null, ':hover': 'pointer' },
  },
  mainHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
    marginLeft: '30px',
    paddingTop: spacing['--gf-spacing-x1'],
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: 0,
    gap: spacing['--gf-spacing-x0-5'],
  },
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors['--gf-colors-border-weak'],
  },
  triageButtonContainer: {
    paddingTop: spacing['--gf-spacing-x1'],
    paddingRight: spacing['--gf-spacing-x2'],
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: spacing['--gf-spacing-x2'],
  },
});

// CollapseToggle's Button has no xstyle, and this override must also win in its :hover state.
const collapseToggleStyle = {
  background: 'none',
  border: 'none',
  marginTop: `calc(${spacing['--gf-spacing-x1']} * -1)`,
  marginBottom: `calc(${spacing['--gf-spacing-x1']} * -1)`,
};

/**
 * This is a scene object that displays a list of history events.
 */

interface HistoryEventsListObjectState extends SceneObjectState {
  hideAlertRuleColumn?: boolean;
}

export class HistoryEventsListObject extends SceneObjectBase<HistoryEventsListObjectState> {
  public static Component = HistoryEventsListObjectRenderer;

  protected _variableDependency = new VariableDependencyConfig(this, {
    variableNames: [LABELS_FILTER, STATE_FILTER_FROM, STATE_FILTER_TO],
  });
}

export type FilterType = 'label' | 'stateFrom' | 'stateTo';

export function HistoryEventsListObjectRenderer({ model }: SceneComponentProps<HistoryEventsListObject>) {
  // This make sure the component is re-rendered when the variables change
  const { hideAlertRuleColumn } = model.useState();

  const { value: timeRange } = sceneGraph.getTimeRange(model).useState(); // get time range from scene graph

  const labelsFiltersVariable = sceneGraph.lookupVariable(LABELS_FILTER, model);
  const stateToFilterVariable = sceneGraph.lookupVariable(STATE_FILTER_TO, model);
  const stateFromFilterVariable = sceneGraph.lookupVariable(STATE_FILTER_FROM, model);

  const addFilter = (key: string, value: string, type: FilterType) => {
    const newFilterToAdd = `${key}=${value}`;
    trackUseCentralHistoryFilterByClicking({ type, key, value });
    if (type === 'stateTo' && stateToFilterVariable instanceof CustomVariable) {
      stateToFilterVariable.changeValueTo(value);
    }
    if (type === 'stateFrom' && stateFromFilterVariable instanceof CustomVariable) {
      stateFromFilterVariable.changeValueTo(value);
    }
    if (type === 'label' && labelsFiltersVariable instanceof TextBoxVariable) {
      const finalFilter = combineMatcherStrings(labelsFiltersVariable.state.value.toString(), newFilterToAdd);
      labelsFiltersVariable.setValue(finalFilter);
    }
  };

  if (
    stateToFilterVariable instanceof CustomVariable &&
    stateFromFilterVariable instanceof CustomVariable &&
    labelsFiltersVariable instanceof TextBoxVariable
  ) {
    return (
      <HistoryEventsList
        timeRange={timeRange}
        valueInLabelFilter={labelsFiltersVariable.state.value}
        addFilter={addFilter}
        valueInStateToFilter={stateToFilterVariable.state.value}
        valueInStateFromFilter={stateFromFilterVariable.state.value}
        hideAlertRuleColumn={hideAlertRuleColumn}
      />
    );
  } else {
    return null;
  }
}
