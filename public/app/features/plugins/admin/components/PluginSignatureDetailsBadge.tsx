import * as stylex from '@stylexjs/stylex';
import { capitalize } from 'lodash';
import * as React from 'react';

import { PluginSignatureType } from '@grafana/data';
import { Trans } from '@grafana/i18n';
import { Icon, Badge, type IconName } from '@grafana/ui';
import { colors } from '@grafana/ui/stylex/tokens.stylex';

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
        <div {...stylex.props(styles.detailsWrapper)}>
          <strong {...stylex.props(styles.strong)}>Level:&nbsp;</strong>
          <Icon size="xs" name={signatureIcon} />
          &nbsp;
          {signatureTypeText}
        </div>
      </DetailsBadge>

      <DetailsBadge>
        <strong {...stylex.props(styles.strong)}>
          <Trans i18nKey="plugins.plugin-signature-details-badge.signed-by" values={{ signatureOrg }}>
            Signed by: {{ signatureOrg }}
          </Trans>
        </strong>
      </DetailsBadge>
    </>
  );
}

export const DetailsBadge = ({ children }: React.PropsWithChildren<{}>) => {
  return <Badge color="green" style={badgeStyle} text={children} />;
};

// Badge is StyleX: override it through its inline style, since StyleX class conflicts only resolve within one
// stylex.props() call.
const badgeStyle: React.CSSProperties = {
  backgroundColor: colors['--gf-colors-background-canvas'],
  borderColor: colors['--gf-colors-border-strong'],
  color: colors['--gf-colors-text-secondary'],
  whiteSpace: 'nowrap',
};

const styles = stylex.create({
  detailsWrapper: {
    alignItems: 'center',
    display: 'flex',
  },
  strong: {
    color: colors['--gf-colors-text-primary'],
  },
});
