import { css } from '@emotion/css';
import { uniqueId } from 'lodash';

import {
  type DataSourcePluginOptionsEditorProps,
  onUpdateDatasourceSecureJsonDataOption,
  updateDatasourcePluginResetOption,
} from '@grafana/data';
import { Field, InlineLabel, InlineSwitch, Input, SecretInput } from '@grafana/ui';

import { type InfluxOptions, type InfluxSecureJsonData } from '../../../types';

import { WIDTH_SHORT } from './constants';
import { trackInfluxDBConfigV1SQLDatabaseInputField, trackInfluxDBConfigV1SQLTokenInputField } from './trackingv1';

export type Props = DataSourcePluginOptionsEditorProps<InfluxOptions, InfluxSecureJsonData>;

export const InfluxSqlConfig = (props: Props) => {
  const { options, onOptionsChange } = props;
  const { jsonData, secureJsonData, secureJsonFields } = options;
  const htmlPrefix = uniqueId('influxdb-sql-config');

  return (
    <div>
      <Field
        horizontal
        label={<InlineLabel width={WIDTH_SHORT}>Database</InlineLabel>}
        className={styles.horizontalField}
        htmlFor={`${htmlPrefix}-dbName`}
      >
        <Input
          id={`${htmlPrefix}-dbName`}
          className="width-20"
          aria-label="Database or bucket name"
          value={jsonData.dbName}
          onChange={(event) => {
            onOptionsChange({
              ...options,
              jsonData: {
                ...jsonData,
                dbName: event.currentTarget.value,
              },
            });
          }}
          onBlur={trackInfluxDBConfigV1SQLDatabaseInputField}
        />
      </Field>
      <Field horizontal label={<InlineLabel width={WIDTH_SHORT}>Token</InlineLabel>} className={styles.horizontalField}>
        <SecretInput
          label="Token"
          aria-label="Token"
          className="width-20"
          value={secureJsonData?.token || ''}
          onReset={() => updateDatasourcePluginResetOption(props, 'token')}
          onChange={onUpdateDatasourceSecureJsonDataOption(props, 'token')}
          isConfigured={Boolean(secureJsonFields && secureJsonFields.token)}
          onBlur={trackInfluxDBConfigV1SQLTokenInputField}
        />
      </Field>
      <Field
        horizontal
        label={<InlineLabel width={WIDTH_SHORT}>Insecure Connection</InlineLabel>}
        className={styles.horizontalField}
      >
        <InlineSwitch
          id={`${htmlPrefix}-insecure-grpc`}
          value={jsonData.insecureGrpc ?? false}
          onChange={(event) => {
            onOptionsChange({
              ...options,
              jsonData: {
                ...jsonData,
                insecureGrpc: event.currentTarget.checked,
              },
            });
          }}
        />
      </Field>
    </div>
  );
};

// stylex: pending Field migration. Field sets its own justifyContent and marginBottom in Emotion, which beat a StyleX
// override.
const styles = {
  horizontalField: css({
    justifyContent: 'initial',
    margin: '0 var(--gf-spacing-x0-5) var(--gf-spacing-x0-5) 0',
  }),
};
