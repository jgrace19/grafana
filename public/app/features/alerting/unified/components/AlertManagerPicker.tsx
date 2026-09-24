import * as stylex from '@stylexjs/stylex';
import { type ComponentProps, useMemo } from 'react';

import { type SelectableValue } from '@grafana/data';
import { t } from '@grafana/i18n';
import { InlineField, Select, SelectMenuOptions } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

import { useAlertmanager } from '../state/AlertmanagerContext';
import { type AlertManagerDataSource, GRAFANA_RULES_SOURCE_NAME } from '../utils/datasource';
import './AlertManagerPicker.css';

interface Props {
  disabled?: boolean;
}

function getAlertManagerLabel(alertManager: AlertManagerDataSource) {
  if (alertManager.name === GRAFANA_RULES_SOURCE_NAME) {
    return 'Grafana';
  }

  return alertManager.displayName || alertManager.name;
}

export const AlertManagerPicker = ({ disabled = false }: Props) => {
  const { selectedAlertmanager, availableAlertManagers, setSelectedAlertmanager } = useAlertmanager();

  const options = useMemo(() => {
    const grafanaAM = availableAlertManagers.find((am) => am.name === GRAFANA_RULES_SOURCE_NAME);
    const datasourceAMs = availableAlertManagers.filter((am) => am.name !== GRAFANA_RULES_SOURCE_NAME);

    const groupedOptions: Array<SelectableValue<string> | { label: string; options: Array<SelectableValue<string>> }> =
      [];

    if (grafanaAM) {
      groupedOptions.push({
        label: getAlertManagerLabel(grafanaAM),
        value: grafanaAM.name,
        imgUrl: grafanaAM.imgUrl,
        meta: grafanaAM.meta,
      });
    }

    if (datasourceAMs.length > 0) {
      groupedOptions.push({
        label: t('alerting.alert-manager-picker.external-alertmanagers-group', 'External Alertmanagers'),
        options: datasourceAMs.map((ds) => ({
          label: getAlertManagerLabel(ds),
          value: ds.name,
          imgUrl: ds.imgUrl,
          meta: ds.meta,
        })),
      });
    }

    return groupedOptions;
  }, [availableAlertManagers]);

  const isDisabled = disabled || options.length === 1;
  const label = isDisabled ? 'Alertmanager' : 'Choose Alertmanager';

  return (
    <InlineField
      className="gf-alerting-am-picker-field"
      label={label}
      disabled={isDisabled}
      data-testid="alertmanager-picker"
    >
      <Select
        aria-label={label}
        width={29}
        className="ds-picker select-container"
        backspaceRemovesValue={false}
        onChange={(value) => {
          if (value?.value) {
            setSelectedAlertmanager(value.value);
          }
        }}
        options={options}
        noOptionsMessage={t(
          'alerting.alert-manager-picker.noOptionsMessage-no-datasources-found',
          'No datasources found'
        )}
        value={selectedAlertmanager}
        getOptionLabel={(o) => o.label}
        components={{ Option: CustomOption }}
      />
    </InlineField>
  );
};

// custom option that overwrites the default "white-space: nowrap" for Alertmanager names that are really long
const CustomOption = (props: ComponentProps<typeof SelectMenuOptions>) => {
  return (
    <SelectMenuOptions
      {...props}
      renderOptionLabel={({ label }) => <div {...stylex.props(styles.optionContent)}>{label}</div>}
    />
  );
};

const styles = stylex.create({
  optionContent: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing['--gf-spacing-x1'],
    whiteSpace: 'pre-line',
  },
});
