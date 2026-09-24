import * as stylex from '@stylexjs/stylex';
import type { JSX } from 'react';

import { SIGV4ConnectionConfig } from '@grafana/aws-sdk';
import { hasCredentials } from '@grafana/azure-sdk';
import { type DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { AdvancedHttpSettings, ConfigSection, DataSourceDescription } from '@grafana/plugin-ui';
import { AlertingSettingsOverhaul, type PromOptions, PromSettings } from '@grafana/prometheus';
import { config } from '@grafana/runtime';
import { Alert, FieldValidationMessage, TextLink } from '@grafana/ui';

import { AzureAuthSettings } from './AzureAuthSettings';
import { type AzurePromDataSourceSettings, setDefaultCredentials, resetCredentials } from './AzureCredentialsConfig';
import { DataSourcehttpSettingsOverhaul } from './DataSourceHttpSettingsOverhaulPackage';

export const PROM_CONFIG_LABEL_WIDTH = 30;

export type Props = DataSourcePluginOptionsEditorProps<PromOptions>;

export const ConfigEditor = (props: Props) => {
  const { options, onOptionsChange } = props;

  const azureAuthSettings = {
    azureAuthSupported: config.azureAuthEnabled,
    getAzureAuthEnabled: (config: AzurePromDataSourceSettings): boolean => hasCredentials(config),
    setAzureAuthEnabled: (config: AzurePromDataSourceSettings, enabled: boolean) =>
      enabled ? setDefaultCredentials(config) : resetCredentials(config),
    azureSettingsUI: AzureAuthSettings,
  };

  return (
    <>
      {options.access === 'direct' && (
        <Alert title="Error" severity="error">
          Browser access mode in the Prometheus data source is no longer available. Switch to server access mode.
        </Alert>
      )}
      <DataSourceDescription
        dataSourceName="Prometheus"
        docsLink="https://grafana.com/docs/grafana/latest/datasources/prometheus/configure/"
      />
      <hr {...stylex.props(styles.hrTopSpace, styles.hrBottomSpace)} />
      <DataSourcehttpSettingsOverhaul
        options={options}
        onOptionsChange={onOptionsChange}
        azureAuthSettings={azureAuthSettings}
        sigV4AuthToggleEnabled={config.sigV4AuthEnabled}
        renderSigV4Editor={
          <SIGV4ConnectionConfig inExperimentalAuthComponent={true} {...props}></SIGV4ConnectionConfig>
        }
        secureSocksDSProxyEnabled={config.secureSocksDSProxyEnabled}
      />
      <hr />
      <ConfigSection
        className={stylex.props(styles.advancedSettings).className}
        title="Advanced settings"
        description="Additional settings are optional settings that can be configured for more control over your data source."
      >
        <AdvancedHttpSettings
          className={stylex.props(styles.advancedHTTPSettingsMargin).className}
          config={options}
          onChange={onOptionsChange}
        />
        <AlertingSettingsOverhaul<PromOptions> options={options} onOptionsChange={onOptionsChange} />
        <PromSettings options={options} onOptionsChange={onOptionsChange} />
      </ConfigSection>
    </>
  );
};
/**
 * Use this to return a url in a tooltip in a field. Don't forget to make the field interactive to be able to click on the tooltip
 * @param url
 * @returns
 */
export function docsTip(url?: string) {
  const docsUrl = 'https://grafana.com/docs/grafana/latest/datasources/prometheus/#configure-the-data-source';

  return (
    <TextLink href={url ? url : docsUrl} external>
      Visit docs for more details here.
    </TextLink>
  );
}

export const validateInput = (
  input: string,
  pattern: string | RegExp,
  errorMessage?: string
): boolean | JSX.Element => {
  const defaultErrorMessage = 'Value is not valid';
  if (input && !input.match(pattern)) {
    return <FieldValidationMessage>{errorMessage ? errorMessage : defaultErrorMessage}</FieldValidationMessage>;
  } else {
    return true;
  }
};

const styles = stylex.create({
  hrBottomSpace: {
    marginBottom: '56px',
  },
  hrTopSpace: {
    marginTop: '50px',
  },
  advancedHTTPSettingsMargin: {
    marginTop: '24px',
    marginRight: 0,
    marginBottom: '8px',
    marginLeft: 0,
  },
  advancedSettings: {
    paddingTop: '32px',
  },
});
