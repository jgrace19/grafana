import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { pluginDetailsHeaderSignatureStyles } from './PluginDetailsHeaderSignature.stylex';
import * as React from 'react';

import { PluginSignatureBadge } from '@grafana/ui';

import { type CatalogPlugin } from '../types';

type Props = {
  plugin: CatalogPlugin;
};

// Designed to show plugin signature information in the header on the plugin's details page
export function PluginDetailsHeaderSignature({ plugin }: Props): React.ReactElement {

  return (
    <div {...stylex.props(pluginDetailsHeaderSignatureStyles.container)}>
      <a
        href="https://grafana.com/docs/grafana/latest/plugins/plugin-signatures/"
        target="_blank"
        rel="noreferrer"
        {...stylex.props(pluginDetailsHeaderSignatureStyles.link)}
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

export ;
