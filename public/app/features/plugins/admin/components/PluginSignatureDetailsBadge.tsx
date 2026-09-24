import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { pluginSignatureDetailsBadgeStyles } from './PluginSignatureDetailsBadge.stylex';
import { capitalize } from 'lodash';
import * as React from 'react';

import { Trans } from '@grafana/i18n';
import { Icon, Badge, type IconName } from '@grafana/ui';

const SIGNATURE_ICONS: Record<string, IconName> = {
  [PluginSignatureType.grafana]: 'grafana',
  [PluginSignatureType.commercial]: 'shield',
  [PluginSignatureType.community]: 'shield',
  DEFAULT: 'shield-exclamation',
};

type Props = {
  signatureType?: PluginSignatureType;
  signatureOrg?: string;
};

// Shows more information about a valid signature
export function PluginSignatureDetailsBadge({ signatureType, signatureOrg = '' }: Props): React.ReactElement | null {

  if (!signatureType && !signatureOrg) {
    return null;
  }

  const signatureTypeText = signatureType === PluginSignatureType.grafana ? 'Grafana Labs' : capitalize(signatureType);
  const signatureIcon = SIGNATURE_ICONS[signatureType || ''] || SIGNATURE_ICONS.DEFAULT;

  return (
    <>
      <DetailsBadge>
        <div {...stylex.props(pluginSignatureDetailsBadgeStyles.detailsWrapper)}>
          <strong {...stylex.props(pluginSignatureDetailsBadgeStyles.strong)}>Level:&nbsp;</strong>
          <Icon size="xs" name={signatureIcon} />
          &nbsp;
          {signatureTypeText}
        </div>
      </DetailsBadge>

      <DetailsBadge>
        <strong {...stylex.props(pluginSignatureDetailsBadgeStyles.strong)}>
          <Trans i18nKey="plugins.plugin-signature-details-badge.signed-by" values={{ signatureOrg }}>
            Signed by: {{ signatureOrg }}
          </Trans>
        </strong>
      </DetailsBadge>
    </>
  );
}

export const DetailsBadge = ({ children }: React.PropsWithChildren<{}>) => {

  return <Badge color="green" {...stylex.props(pluginSignatureDetailsBadgeStyles.badge)} text={children} />;
};

