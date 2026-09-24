import * as stylex from '@stylexjs/stylex';

import { Trans, t } from '@grafana/i18n';
import { config } from '@grafana/runtime';
import { Checkbox, EmptyState, Icon, Spinner, Tooltip } from '@grafana/ui';
import { colors, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

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
  if (errorMap && errorMap.has(id)) {
    return (
      <Tooltip
        content={t('plugins.catalog.update-all.error', 'Error updating plugin: {{errorMessage}}', {
          errorMessage: errorMap.get(id)?.message,
        })}
      >
        <Icon xstyle={styles.errorIcon} size="xl" name="exclamation-triangle" />
      </Tooltip>
    );
  }
  if (isInstalled) {
    return <Icon xstyle={styles.successIcon} size="xl" name="check" />;
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
          <div {...stylex.props(styles.tableContainer)}>
            <table {...stylex.props(styles.table)}>
              <thead {...stylex.props(styles.header)}>
                <tr>
                  <th {...stylex.props(styles.headerCell)}>
                    <Trans i18nKey="plugins.catalog.update-all.update-header">Update</Trans>
                  </th>
                  <th {...stylex.props(styles.headerCell)}>
                    <Trans i18nKey="plugins.catalog.update-all.name-header">Name</Trans>
                  </th>
                  <th {...stylex.props(styles.headerCell)}>
                    <Trans i18nKey="plugins.catalog.update-all.installed-header">Installed</Trans>
                  </th>
                  <th {...stylex.props(styles.headerCell)}>
                    <Trans i18nKey="plugins.catalog.update-all.available-header">Available</Trans>
                  </th>
                  <th {...stylex.props(styles.headerCell)}></th>
                </tr>
              </thead>
              <tbody>
                {plugins.map(({ id, name, installedVersion, latestVersion }: CatalogPlugin) => (
                  <tr key={id} {...stylex.props(styles.tableRow)}>
                    <td {...stylex.props(styles.rowCell)}>
                      <Checkbox
                        onChange={() => onCheckboxChange(id)}
                        value={selectedPlugins?.has(id)}
                        disabled={!pluginsNotInstalled.has(id)}
                      />
                    </td>
                    <td {...stylex.props(styles.rowCell)}>{name}</td>
                    <td {...stylex.props(styles.rowCell)}>{installedVersion}</td>
                    <td {...stylex.props(styles.rowCell)}>{latestVersion}</td>
                    <td {...stylex.props(styles.rowCell, styles.icon)}>
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
            <div>
              <Icon xstyle={[styles.successIcon, styles.pluginsInstalledIcon]} size="lg" name="check" />
              {`${numberInstalled} ${t('plugins.catalog.update-all.update-status-text', 'plugins updated')}`}
            </div>
          )}
          {errorMap.size > 0 && installationFinished && (
            <div>
              <Icon xstyle={[styles.errorIcon, styles.pluginsInstalledIcon]} size="lg" name="exclamation-triangle" />
              {`${errorMap.size} ${t('plugins.catalog.update-all.error-status-text', 'failed - see error messages')}`}
            </div>
          )}
          {config.pluginAdminExternalManageEnabled && (
            <footer {...stylex.props(styles.footer)}>
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

const styles = stylex.create({
  table: {
    marginTop: spacing['--gf-spacing-x2'],
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableRow: {
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors['--gf-colors-border-weak'],
  },
  rowCell: {
    paddingRight: spacing['--gf-spacing-x1'],
  },
  icon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    textAlign: 'left',
    paddingTop: spacing['--gf-spacing-x1'],
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: spacing['--gf-spacing-x1'],
    borderBottomWidth: '2px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors['--gf-colors-border-strong'],
  },
  headerCell: {
    paddingRight: spacing['--gf-spacing-x1'],
  },
  footer: {
    fontSize: typography['--gf-typography-body-small-font-size'],
    marginTop: spacing['--gf-spacing-x3'],
  },
  tableContainer: {
    overflowY: 'auto',
    overflowX: 'hidden',
    maxHeight: `calc(${spacing['--gf-spacing-grid-size']} * 41)`,
    marginBottom: spacing['--gf-spacing-x2'],
  },
  errorIcon: {
    color: colors['--gf-colors-error-main'],
  },
  successIcon: {
    color: colors['--gf-colors-success-main'],
  },
  pluginsInstalledIcon: {
    marginRight: spacing['--gf-spacing-x1'],
  },
});
