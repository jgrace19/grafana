// Core Grafana history https://github.com/grafana/grafana/blob/v11.0.0-preview/public/app/plugins/datasource/prometheus/configuration/ExemplarsSettings.tsx
import * as stylex from '@stylexjs/stylex';

import { selectors } from '@grafana/e2e-selectors';
import { t, Trans } from '@grafana/i18n';
import { ConfigSubSection } from '@grafana/plugin-ui';
import { Button, useTheme2 } from '@grafana/ui';
import { mergeStylexClassName } from '@grafana/ui/unstable';

import { type ExemplarTraceIdDestination } from '../types';

import { exemplarsSettingsStyles } from './ExemplarsSettings.stylex';
import { ExemplarSetting } from './ExemplarSetting';
import { overhaulStyles } from './shared/utils';

type Props = {
  options?: ExemplarTraceIdDestination[];
  onChange: (value: ExemplarTraceIdDestination[]) => void;
  disabled?: boolean;
};

export function ExemplarsSettings({ options, onChange, disabled }: Props) {
  const theme = useTheme2();
  const styles = overhaulStyles(theme);
  return (
    <div className={styles.sectionBottomPadding}>
      <ConfigSubSection
        title={t('grafana-prometheus.configuration.exemplars-settings.title-exemplars', 'Exemplars')}
        className={styles.container}
      >
        {options &&
          options.map((option, index) => {
            return (
              <ExemplarSetting
                key={index}
                value={option}
                onChange={(newField) => {
                  const newOptions = [...options];
                  newOptions.splice(index, 1, newField);
                  onChange(newOptions);
                }}
                onDelete={() => {
                  const newOptions = [...options];
                  newOptions.splice(index, 1);
                  onChange(newOptions);
                }}
                disabled={disabled}
              />
            );
          })}

        {!disabled && (
          <Button
            variant="secondary"
            data-testid={selectors.components.DataSource.Prometheus.configPage.exemplarsAddButton}
            {...mergeStylexClassName(stylex.props(exemplarsSettingsStyles.addButtonMargin))}
            icon="plus"
            onClick={(event) => {
              event.preventDefault();
              const newOptions = [...(options || []), { name: 'traceID' }];
              onChange(newOptions);
            }}
          >
            <Trans i18nKey="grafana-prometheus.configuration.exemplars-settings.add">Add</Trans>
          </Button>
        )}
        {disabled && !options && (
          <i>
            <Trans i18nKey="grafana-prometheus.configuration.exemplars-settings.no-exemplars-configurations">
              No exemplars configurations
            </Trans>
          </i>
        )}
      </ConfigSubSection>
    </div>
  );
}
