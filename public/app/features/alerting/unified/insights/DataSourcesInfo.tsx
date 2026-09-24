import * as stylex from '@stylexjs/stylex';

import { typography } from '@grafana/ui/stylex/tokens.stylex';

import { type DataSourceInformation } from '../home/Insights';

export function DataSourcesInfo({ datasources }: { datasources: DataSourceInformation[] }) {
  const displayDs = datasources.map((ds) => (
    <div key={ds.uid}>
      {ds.settings?.meta.info.logos.small && (
        <img
          {...stylex.props(styles.dsImage)}
          src={ds.settings?.meta.info.logos.small}
          alt={ds.settings?.name || ds.uid}
        />
      )}
      <span>{ds.settings?.name || ds.uid}</span>
    </div>
  ));

  return <div {...stylex.props(styles.dsContainer)}>{displayDs}</div>;
}

const styles = stylex.create({
  dsImage: {
    width: '16px',
    marginRight: '3px',
  },
  dsContainer: {
    display: 'flex',
    flexDirection: 'row',
    fontSize: typography['--gf-typography-body-small-font-size'],
    gap: '10px',
    marginBottom: '10px',
    justifyContent: 'flex-end',
  },
});
