import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { PluginSignatureBadge } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

import { type CatalogPlugin } from '../types';

type Props = {
  plugin: CatalogPlugin;
};

// Designed to show plugin signature information in the header on the plugin's details page
export function PluginDetailsHeaderSignature({ plugin }: Props): React.ReactElement {
  return (
    <div {...stylex.props(styles.container)}>
      <a
        href="https://grafana.com/docs/grafana/latest/plugins/plugin-signatures/"
        target="_blank"
        rel="noreferrer"
        {...stylex.props(styles.link)}
      >
        <PluginSignatureBadge
          status={plugin.signature}
          signatureType={plugin.signatureType}
          signatureOrg={plugin.signatureOrg}
        />
      </a>
    </div>
  );
}

const styles = stylex.create({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: spacing['--gf-spacing-x0-5'],
  },
  link: {
    display: 'inline-flex',
    alignItems: 'center',
  },
});
