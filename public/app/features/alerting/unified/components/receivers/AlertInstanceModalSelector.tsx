import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { alertInstanceModalSelectorStyles } from './AlertInstanceModalSelector.stylex';
import { type CSSProperties, useCallback, useMemo, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList } from 'react-window';

import { Trans, t } from '@grafana/i18n';
import {
  Button,
  FilterInput,
  Icon,
  LoadingPlaceholder,
  Modal,
  Tag,
  Tooltip,
  clearButtonStyles
} from '@grafana/ui';
import { type AlertmanagerAlert, type TestTemplateAlert } from 'app/plugins/datasource/alertmanager/types';

import { alertmanagerApi } from '../../api/alertmanagerApi';
import { GRAFANA_RULES_SOURCE_NAME } from '../../utils/datasource';
import { arrayLabelsToObject, labelsToTags, objectLabelsToArray } from '../../utils/labels';
import { extractCommonLabels, omitLabels } from '../rules/state-history/common';

export function AlertInstanceModalSelector({
  onSelect,
  isOpen,
  onClose,
}: {
  onSelect: (alerts: TestTemplateAlert[]) => void;
  isOpen: boolean;
  onClose: () => void;
}) {

  const [selectedRule, setSelectedRule] = useState<string>();
  const [selectedInstances, setSelectedInstances] = useState<AlertmanagerAlert[] | null>(null);
  const { useGetAlertmanagerAlertsQuery } = alertmanagerApi;

  const {
    currentData: result = [],
    isFetching: loading,
    isError: error,
  } = useGetAlertmanagerAlertsQuery({
    amSourceName: GRAFANA_RULES_SOURCE_NAME,
    filter: {
      inhibited: true,
      silenced: true,
      active: true,
    },
  });

  const [ruleFilter, setRuleFilter] = useState('');

  const rulesWithInstances: Record<string, AlertmanagerAlert[]> = useMemo(() => {
    const rules: Record<string, AlertmanagerAlert[]> = {};
    if (!loading && result) {
      result.forEach((instance) => {
        if (!rules[instance.labels.alertname]) {
          rules[instance.labels.alertname] = [];
        }
        const filteredAnnotations = Object.fromEntries(
          Object.entries(instance.annotations).filter(([key]) => !key.startsWith('__'))
        );
        const filteredLabels = Object.fromEntries(
          Object.entries(instance.labels).filter(([key]) => !key.startsWith('__'))
        );
        instance = { ...instance, annotations: filteredAnnotations, labels: filteredLabels };
        rules[instance.labels.alertname].push(instance);
      });
    }
    return rules;
  }, [loading, result]);

  const handleRuleChange = useCallback((rule: string) => {
    setSelectedRule(rule);
    setSelectedInstances(null);
  }, []);

  const filteredRules: Record<string, AlertmanagerAlert[]> = useMemo(() => {
    const filteredRules = Object.keys(rulesWithInstances).filter((rule) =>
      rule.toLowerCase().includes(ruleFilter.toLowerCase())
    );
    const filteredRulesObject: Record<string, AlertmanagerAlert[]> = {};
    filteredRules.forEach((rule) => {
      filteredRulesObject[rule] = rulesWithInstances[rule];
    });
    return filteredRulesObject;
  }, [rulesWithInstances, ruleFilter]);

  if (error) {
    return null;
  }

  const filteredRulesKeys = Object.keys(filteredRules || []);

  const RuleRow = ({ index, style }: { index: number; style?: CSSProperties }) => {
    if (!filteredRules) {
      return null;
    }
    const ruleName = filteredRulesKeys[index];

    const isSelected = ruleName === selectedRule;

    return (
      <button
        type="button"
        title={ruleName}
        style={style}
        {...mergeStylexClassName(stylex.props(alertInstanceModalSelectorStyles.rowButton), { [stylex.props(alertInstanceModalSelectorStyles.rowOdd)]: index % 2 === 1, [stylex.props(alertInstanceModalSelectorStyles.rowSelected)]: isSelected })}
        onClick={() => handleRuleChange(ruleName)}
      >
        <div {...mergeStylexClassName(stylex.props(alertInstanceModalSelectorStyles.ruleTitle), stylex.props(alertInstanceModalSelectorStyles.rowButtonTitle))}>{ruleName}</div>
        <div {...stylex.props(alertInstanceModalSelectorStyles.alertFolder)}>
          <Icon name="folder" /> {filteredRules[ruleName][0].labels.grafana_folder ?? ''}
        </div>
      </button>
    );
  };

  const getAlertUniqueLabels = (allAlerts: AlertmanagerAlert[], currentAlert: AlertmanagerAlert) => {
    const allLabels = allAlerts.map((alert) => alert.labels);
    const labelsAsArray = allLabels.map(objectLabelsToArray);

    const ruleCommonLabels = extractCommonLabels(labelsAsArray);
    const alertUniqueLabels = omitLabels(objectLabelsToArray(currentAlert.labels), ruleCommonLabels);

    const tags = alertUniqueLabels.length
      ? labelsToTags(arrayLabelsToObject(alertUniqueLabels))
      : labelsToTags(currentAlert.labels);

    return tags;
  };

  const InstanceRow = ({ index, style }: { index: number; style: CSSProperties }) => {
    const alerts = useMemo(() => (selectedRule ? rulesWithInstances[selectedRule] : []), []);
    const alert = alerts[index];
    const isSelected = selectedInstances?.includes(alert);
    const tags = useMemo(() => getAlertUniqueLabels(alerts, alert), [alerts, alert]);

    const handleSelectInstances = () => {
      if (isSelected && selectedInstances) {
        setSelectedInstances(selectedInstances.filter((instance) => instance !== alert));
        return;
      }
      setSelectedInstances([...(selectedInstances || []), alert]);
    };

    return (
      <button
        type="button"
        style={style}
        {...mergeStylexClassName(stylex.props(alertInstanceModalSelectorStyles.rowButton), stylex.props(alertInstanceModalSelectorStyles.instanceButton), {
          [stylex.props(alertInstanceModalSelectorStyles.rowOdd)]: index % 2 === 1,
          [stylex.props(alertInstanceModalSelectorStyles.rowSelected)]: isSelected,
        })}
        onClick={handleSelectInstances}
      >
        <div {...stylex.props(alertInstanceModalSelectorStyles.rowButtonTitle)} title={alert.labels.alertname}>
          <Tooltip placement="bottom" content={<pre>{JSON.stringify(alert, null, 2)}</pre>} theme={'info'}>
            <div>
              {tags.map((tag, index) => (
                <Tag key={index} name={tag} {...stylex.props(alertInstanceModalSelectorStyles.tag)} />
              ))}
            </div>
          </Tooltip>
        </div>
      </button>
    );
  };

  const handleConfirm = () => {
    const instances: TestTemplateAlert[] =
      selectedInstances?.map((instance: AlertmanagerAlert) => {
        const alert: TestTemplateAlert = {
          status: 'firing',
          annotations: instance.annotations,
          labels: instance.labels,
          startsAt: instance.startsAt,
          endsAt: instance.endsAt,
          generatorURL: instance.generatorURL,
          fingerprint: instance.fingerprint,
        };
        return alert;
      }) || [];

    onSelect(instances);
    resetState();
  };

  const resetState = () => {
    setSelectedRule(undefined);
    setSelectedInstances(null);
    setRuleFilter('');
    handleSearchRules('');
  };

  const onDismiss = () => {
    resetState();
    onClose();
  };

  const handleSearchRules = (filter: string) => {
    setRuleFilter(filter);
  };

  return (
    <div>
      <Modal
        title={t('alerting.alert-instance-modal-selector.title-select-alert-instances', 'Select alert instances')}
        {...stylex.props(alertInstanceModalSelectorStyles.modal)}
        closeOnEscape
        isOpen={isOpen}
        onDismiss={onDismiss}
        contentClassName={stylex.props(alertInstanceModalSelectorStyles.modalContent)}
      >
        <div {...stylex.props(alertInstanceModalSelectorStyles.container)}>
          <FilterInput
            value={ruleFilter}
            onChange={handleSearchRules}
            title={t('alerting.alert-instance-modal-selector.title-search-alert-rule', 'Search alert rule')}
            placeholder={t('alerting.alert-instance-modal-selector.placeholder-search-alert-rule', 'Search alert rule')}
            autoFocus
          />
          <div>{(selectedRule && 'Select one or more instances from the list below') || ''}</div>

          <div {...stylex.props(alertInstanceModalSelectorStyles.column)}>
            {loading && (
              <LoadingPlaceholder
                text={t('alerting.alert-instance-modal-selector.text-loading-rules', 'Loading rules...')}
                {...stylex.props(alertInstanceModalSelectorStyles.loadingPlaceholder)}
              />
            )}

            {!loading && (
              <AutoSizer>
                {({ height, width }) => (
                  <FixedSizeList itemSize={50} height={height} width={width} itemCount={filteredRulesKeys.length}>
                    {RuleRow}
                  </FixedSizeList>
                )}
              </AutoSizer>
            )}
          </div>

          <div {...stylex.props(alertInstanceModalSelectorStyles.column)}>
            {!selectedRule && !loading && (
              <div {...stylex.props(alertInstanceModalSelectorStyles.selectedRulePlaceholder)}>
                <div>
                  <Trans i18nKey="alerting.alert-instance-modal-selector.select-alert-rule">
                    Select an alert rule to get a list of available firing instances
                  </Trans>
                </div>
              </div>
            )}
            {loading && (
              <LoadingPlaceholder
                text={t('alerting.alert-instance-modal-selector.text-loading-rule', 'Loading rule...')}
                {...stylex.props(alertInstanceModalSelectorStyles.loadingPlaceholder)}
              />
            )}

            {selectedRule && rulesWithInstances[selectedRule].length && !loading && (
              <AutoSizer>
                {({ width, height }) => (
                  <FixedSizeList
                    itemSize={32}
                    height={height}
                    width={width}
                    itemCount={rulesWithInstances[selectedRule].length || 0}
                  >
                    {InstanceRow}
                  </FixedSizeList>
                )}
              </AutoSizer>
            )}
          </div>
        </div>
        <Modal.ButtonRow>
          <Button type="button" variant="secondary" onClick={onDismiss}>
            <Trans i18nKey="alerting.common.cancel">Cancel</Trans>
          </Button>
          <Button
            type="button"
            variant="primary"
            disabled={!(selectedRule && selectedInstances)}
            onClick={() => {
              if (selectedRule && selectedInstances) {
                handleConfirm();
              }
            }}
          >
            <Trans i18nKey="alerting.alert-instance-modal-selector.add-alert-data-to-payload">
              Add alert data to payload
            </Trans>
          </Button>
        </Modal.ButtonRow>
      </Modal>
    </div>
  );
}

