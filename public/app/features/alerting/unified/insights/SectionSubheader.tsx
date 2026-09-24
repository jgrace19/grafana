import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { sectionSubheaderStyles } from './SectionSubheader.stylex';
import * as React from 'react';


import { type DataSourceInformation } from '../home/Insights';

import { DataSourcesInfo } from './DataSourcesInfo';

export function SectionSubheader({
  children,
  datasources,
}: React.PropsWithChildren<{ datasources?: DataSourceInformation[] }>) {

  return (
    <div {...stylex.props(sectionSubheaderStyles.container)}>
      {children}
      {datasources && <DataSourcesInfo datasources={datasources} />}
    </div>
  );
}

