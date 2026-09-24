import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { type DataSourceInformation } from '../home/Insights';

import { DataSourcesInfo } from './DataSourcesInfo';

export function SectionSubheader({
  children,
  datasources,
}: React.PropsWithChildren<{ datasources?: DataSourceInformation[] }>) {
  return (
    <div {...stylex.props(styles.container)}>
      {children}
      {datasources && <DataSourcesInfo datasources={datasources} />}
    </div>
  );
}

const styles = stylex.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
