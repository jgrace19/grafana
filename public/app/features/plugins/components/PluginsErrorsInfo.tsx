import * as stylex from '@stylexjs/stylex';

import { PluginErrorCode, PluginSignatureStatus, type PluginType } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { Trans, t } from '@grafana/i18n';
import { Alert, List, PluginSignatureBadge, Stack, TextLink } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

import { useGetErrors, useFetchStatus } from '../admin/state/hooks';

type PluginsErrorInfoProps = {
  filterByPluginType?: PluginType;
};

export function PluginsErrorsInfo({ filterByPluginType }: PluginsErrorInfoProps) {
  let errors = useGetErrors(filterByPluginType);
  const { isLoading } = useFetchStatus();

  if (isLoading || errors.length === 0) {
    return null;
  }

  return (
    <Alert
      title={t(
        'plugins.plugins-errors-info.title-unsigned-plugins',
        'Unsigned plugins were found during plugin initialization. Grafana Labs cannot guarantee the integrity of these plugins. We recommend only using signed plugins.'
      )}
      data-testid={selectors.pages.PluginsList.signatureErrorNotice}
      severity="warning"
    >
      <p>
        <Trans i18nKey="plugins.plugins-errors-info.disabled-list">
          The following plugins are disabled and not shown in the list below:
        </Trans>
      </p>
      <List
        items={errors}
        renderItem={(error) => (
          <div {...stylex.props(styles.wrapper)}>
            <Stack justifyContent="flex-start" alignItems="center">
              <strong>{error.pluginId}</strong>
              <PluginSignatureBadge
                status={mapPluginErrorCodeToSignatureStatus(error.errorCode)}
                className={stylex.props(styles.badge).className}
              />
            </Stack>
          </div>
        )}
      />
      <TextLink href="https://grafana.com/docs/grafana/latest/plugins/plugin-signatures/" external>
        <Trans i18nKey="plugins.plugins-errors-info.read-more-about-plugin-signing">
          Read more about plugin signing
        </Trans>
      </TextLink>
    </Alert>
  );
}

function mapPluginErrorCodeToSignatureStatus(code: PluginErrorCode) {
  switch (code) {
    case PluginErrorCode.invalidSignature:
      return PluginSignatureStatus.invalid;
    case PluginErrorCode.missingSignature:
      return PluginSignatureStatus.missing;
    case PluginErrorCode.modifiedSignature:
      return PluginSignatureStatus.modified;
    default:
      return PluginSignatureStatus.missing;
  }
}

const styles = stylex.create({
  wrapper: {
    marginTop: spacing['--gf-spacing-x1'],
  },
  badge: {
    marginTop: 0,
  },
});
