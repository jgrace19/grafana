import * as stylex from '@stylexjs/stylex';


import { type DataSourceInformation } from '../home/Insights';

export function DataSourcesInfo({ datasources }: { datasources: DataSourceInformation[] }) {

  const displayDs = datasources.map((ds) => (
    <div key={ds.uid}>
      {ds.settings?.meta.info.logos.small && (
        <img {...stylex.props(dataSourcesInfoStyles.dsImage)} src={ds.settings?.meta.info.logos.small} alt={ds.settings?.name || ds.uid} />
      )}
      <span>{ds.settings?.name || ds.uid}</span>
    </div>
  ));

  return <div {...stylex.props(dataSourcesInfoStyles.dsContainer)}>{displayDs}</div>;
}

