
import { Trans, t } from '@grafana/i18n';
import { config } from '@grafana/runtime';
import { Checkbox, EmptyState, Icon, Spinner, Tooltip, } from '@grafana/ui';

import { type CatalogPlugin } from '../types';

type UpdateError = {
  id: string;
  message: string;
};


const StatusIcon = ({
  id,
  inProgress,
  isSelected,
  isInstalled,
  errorMap,
}: {
  id: string;
  inProgress: boolean;
  isSelected: boolean;
  isInstalled: boolean;
  errorMap: Map<string, UpdateError>;
}) => {
  const styles = (getStyles);

  if (errorMap && errorMap.has(id)) {
    return (
      <Tooltip
        content={t('plugins.catalog.update-all.error', 'Error updating plugin: {{errorMessage}}', {
          errorMessage: errorMap.get(id)?.message,
        })}
      >
        <Icon {...stylex.props(updateAllModalBodyStyles.errorIcon)} size="xl" name="exclamation-triangle" />
      </Tooltip>
    );
  }
  if (isInstalled) {
    return <Icon {...stylex.props(updateAllModalBodyStyles.successIcon)} size="xl" name="check" />;
  }
  if (inProgress && isSelected) {
    return <Spinner />;
  }
  return '';
};

type Props = {
  plugins: CatalogPlugin[];
  pluginsNotInstalled: Set<string>;
  inProgress: boolean;
  selectedPlugins?: Set<string>;
  onCheckboxChange: (id: string) => void;
  errorMap: Map<string, UpdateError>;
};

export const UpdateModalBody = ({
  plugins,
  pluginsNotInstalled,
  inProgress,
  selectedPlugins,
  onCheckboxChange,
  errorMap,
}: Props) => {
  const styles = (getStyles);

  const numberInstalled = plugins.length - pluginsNotInstalled.size;
  const installationFinished = plugins.length !== pluginsNotInstalled.size && !inProgress;

  return (
    <div>
      {plugins.length === 0 ? (
        <EmptyState
          variant="completed"
          message={t('plugins.catalog.update-all.all-plugins-updated', 'All plugins updated!')}
        />
      ) : (
        <>
          <div>
            <Trans i18nKey="plugins.catalog.update-all.header">The following plugins have update available</Trans>
          </div>
          <div {...stylex.props(updateAllModalBodyStyles.tableContainer)}>
            <table {...stylex.props(updateAllModalBodyStyles.table)}>
              <thead {...stylex.props(updateAllModalBodyStyles.header)}>
                <tr>
                  <th>
                    <Trans i18nKey="plugins.catalog.update-all.update-header">Update</Trans>
                  </th>
                  <th>
                    <Trans i18nKey="plugins.catalog.update-all.name-header">Name</Trans>
                  </th>
                  <th>
                    <Trans i18nKey="plugins.catalog.update-all.installed-header">Installed</Trans>
                  </th>
                  <th>
                    <Trans i18nKey="plugins.catalog.update-all.available-header">Available</Trans>
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {plugins.map(({ id, name, installedVersion, latestVersion }: CatalogPlugin) => (
                  <tr key={id} {...stylex.props(updateAllModalBodyStyles.tableRow)}>
                    <td>
                      <Checkbox
                        onChange={() => onCheckboxChange(id)}
                        value={selectedPlugins?.has(id)}
                        disabled={!pluginsNotInstalled.has(id)}
                      />
                    </td>
                    <td>{name}</td>
                    <td>{installedVersion}</td>
                    <td>{latestVersion}</td>
                    <td {...stylex.props(updateAllModalBodyStyles.icon)}>
                      <StatusIcon
                        id={id}
                        inProgress={inProgress}
                        isSelected={selectedPlugins?.has(id) ?? false}
                        isInstalled={!pluginsNotInstalled.has(id)}
                        errorMap={errorMap}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {numberInstalled > 0 && installationFinished && (
            <div {...stylex.props(updateAllModalBodyStyles.pluginsInstalled)}>
              <Icon {...stylex.props(updateAllModalBodyStyles.successIcon)} size="lg" name="check" />
              {`${numberInstalled} ${t('plugins.catalog.update-all.update-status-text', 'plugins updated')}`}
            </div>
          )}
          {errorMap.size > 0 && installationFinished && (
            <div {...stylex.props(updateAllModalBodyStyles.pluginsInstalled)}>
              <Icon {...stylex.props(updateAllModalBodyStyles.errorIcon)} size="lg" name="exclamation-triangle" />
              {`${errorMap.size} ${t('plugins.catalog.update-all.error-status-text', 'failed - see error messages')}`}
            </div>
          )}
          {config.pluginAdminExternalManageEnabled && (
            <footer {...stylex.props(updateAllModalBodyStyles.footer)}>
              <Trans i18nKey="plugins.catalog.update-all.cloud-update-message">
                * It may take a few minutes for the plugins to be available for usage.
              </Trans>
            </footer>
          )}
        </>
      )}
    </div>
  );
};
