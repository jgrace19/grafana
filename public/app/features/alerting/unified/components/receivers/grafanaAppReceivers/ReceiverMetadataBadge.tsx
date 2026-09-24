import * as stylex from '@stylexjs/stylex';

import { t } from '@grafana/i18n';
import { Icon, LinkButton, Stack, Tooltip } from '@grafana/ui';

import { type ReceiverPluginMetadata } from './useReceiversMetadata';

interface Props {
  metadata: ReceiverPluginMetadata;
}

export const ReceiverMetadataBadge = ({ metadata: { icon, title, externalUrl, warning } }: Props) => {

  return (
    <Stack alignItems="center" gap={0.5}>
      <Stack direction="row" alignItems="center" gap={0.5}>
        {warning ? (
          <Tooltip content={warning} theme="error">
            <Icon name="exclamation-triangle" {...stylex.props(receiverMetadataBadgeStyles.warnIcon)} />
          </Tooltip>
        ) : (
          <img src={icon} alt={title} height="16px" />
        )}
        <span>{title}</span>
      </Stack>
      {externalUrl && (
        <LinkButton
          aria-label={t('alerting.receiver-metadata-badge.aria-label-open-external-link', 'Open external link')}
          icon="external-link-alt"
          href={externalUrl}
          target="_blank"
          variant="secondary"
          size="sm"
        />
      )}
    </Stack>
  );
};

