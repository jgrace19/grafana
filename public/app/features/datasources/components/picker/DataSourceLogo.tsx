
import { type DataSourceInstanceSettings, type DataSourceJsonData, type GrafanaTheme2 } from '@grafana/data';
import { useTheme2 } from '@grafana/ui';

export interface DataSourceLogoProps {
  dataSource: DataSourceInstanceSettings<DataSourceJsonData> | undefined;
  size?: number;
}

export function DataSourceLogo(props: DataSourceLogoProps) {
  const { dataSource, size } = props;
  const theme = useTheme2();
  const styles = getStyles(theme, dataSource?.meta.builtIn, size);

  if (!dataSource) {
    return DataSourceLogoPlaceHolder();
  }

  return (
    <img
      {...stylex.props(dataSourceLogoStyles.pickerDSLogo)}
      alt={`${dataSource.meta.name} logo`}
      src={dataSource.meta.info.logos.small || undefined}
    ></img>
  );
}

export function DataSourceLogoPlaceHolder() {
  const styles = (getStyles);
  return <div {...stylex.props(dataSourceLogoStyles.pickerDSLogo)}></div>;
}

