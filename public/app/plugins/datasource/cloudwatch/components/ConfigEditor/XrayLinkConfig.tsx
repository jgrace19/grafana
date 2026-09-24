import * as stylex from '@stylexjs/stylex';
import { xrayLinkConfigStyles } from './XrayLinkConfig.stylex';

import { ConfigSection } from '@grafana/plugin-ui';
import { DataSourcePicker, getDataSourceSrv } from '@grafana/runtime';
import { Alert, Field, InlineField } from '@grafana/ui';


interface Props {
  datasourceUid?: string;
  onChange: (uid: string) => void;
  newFormStyling?: boolean;
}

const xRayDsId = 'grafana-x-ray-datasource';

export function XrayLinkConfig({ newFormStyling, datasourceUid, onChange }: Props) {
  const hasXrayDatasource = Boolean(getDataSourceSrv().getList({ pluginId: xRayDsId }).length);

  return newFormStyling ? (
    <ConfigSection
      title="Application Signals trace link"
      description="Grafana will automatically create a link to a trace in Application Signals data source if logs contain @xrayTraceId field"
    >
      {!hasXrayDatasource && (
        <Alert
          title={
            'There is no Application Signals datasource to link to. First add an Application Signals data source and then link it to Cloud Watch. '
          }
          severity="info"
        />
      )}
      <Field
        htmlFor="data-source-picker"
        label="Data source"
        description="Application Signals data source containing traces"
      >
        <DataSourcePicker
          pluginId={xRayDsId}
          onChange={(ds: DataSourceInstanceSettings) => onChange(ds.uid)}
          current={datasourceUid}
          noDefault={true}
        />
      </Field>
    </ConfigSection>
  ) : (
    <>
      <h3 className="page-heading">Application Signals trace link</h3>

      <div {...stylex.props(xrayLinkConfigStyles.infoText)}>
        Grafana will automatically create a link to a trace in Application Signals data source if logs contain
        @xrayTraceId field
      </div>

      {!hasXrayDatasource && (
        <Alert
          title={
            'There is no Application Signals datasource to link to. First add an Application Signals data source and then link it to Cloud Watch. '
          }
          severity="info"
        />
      )}

      <div className="gf-form-group">
        <InlineField
          htmlFor="data-source-picker"
          label="Data source"
          labelWidth={28}
          tooltip="Application Signals data source containing traces"
        >
          <DataSourcePicker
            pluginId={xRayDsId}
            onChange={(ds: DataSourceInstanceSettings) => onChange(ds.uid)}
            current={datasourceUid}
            noDefault={true}
          />
        </InlineField>
      </div>
    </>
  );
}
