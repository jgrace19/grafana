
import { selectors } from '@grafana/e2e-selectors';
import { Trans, t } from '@grafana/i18n';
import { Alert, List, PluginSignatureBadge, Stack, TextLink, } from '@grafana/ui';

import { useGetErrors, useFetchStatus } from '../admin/state/hooks';

type PluginsErrorInfoProps = {
  filterByPluginType?: PluginType;
};

export function PluginsErrorsInfo({ filterByPluginType }: PluginsErrorInfoProps) {
  let errors = useGetErrors(filterByPluginType);
  const { isLoading } = useFetchStatus();
  const styles = (getStyles);

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
        {...stylex.props(pluginsErrorsInfoStyles.list)}
        renderItem={(error) => (
          <div {...stylex.props(pluginsErrorsInfoStyles.wrapper)}>
            <Stack justifyContent="flex-start" alignItems="center">
              <strong>{error.pluginId}</strong>
              <PluginSignatureBadge
                status={mapPluginErrorCodeToSignatureStatus(error.errorCode)}
                {...stylex.props(pluginsErrorsInfoStyles.badge)}
              />
            </Stack>
          </div>
        )}
      />
      <TextLink
        href="https://grafana.com/docs/grafana/latest/plugins/plugin-signatures/"
        external
        {...stylex.props(pluginsErrorsInfoStyles.docsLink)}
      >
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

