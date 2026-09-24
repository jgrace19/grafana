import * as stylex from '@stylexjs/stylex';

import { type DataSourceInstanceSettings, type DataSourceJsonData } from '@grafana/data';
import { useTheme2 } from '@grafana/ui';

export interface DataSourceLogoProps {
  dataSource: DataSourceInstanceSettings<DataSourceJsonData> | undefined;
  size?: number;
}

export function DataSourceLogo(props: DataSourceLogoProps) {
  const { dataSource, size = 20 } = props;
  const theme = useTheme2();

  if (!dataSource) {
    return DataSourceLogoPlaceHolder();
  }

  return (
    <img
      {...stylex.props(
        styles.pickerDSLogo(size),
        dataSource.meta.builtIn && theme.isLight ? styles.inverted : styles.notInverted
      )}
      alt={`${dataSource.meta.name} logo`}
      src={dataSource.meta.info.logos.small || undefined}
    ></img>
  );
}

export function DataSourceLogoPlaceHolder() {
  return <div {...stylex.props(styles.pickerDSLogo(20), styles.notInverted)}></div>;
}

const styles = stylex.create({
  pickerDSLogo: (size: number) => ({
    height: size,
    width: size,
  }),
  inverted: {
    filter: 'invert(1)',
  },
  notInverted: {
    filter: 'invert(0)',
  },
});
