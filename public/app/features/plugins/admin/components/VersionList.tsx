import * as stylex from '@stylexjs/stylex';
import { useEffect, useState, useMemo } from 'react';
import { major, compare, lte } from 'semver';

import { dateTimeFormatTimeAgo } from '@grafana/data';
import { Trans, t } from '@grafana/i18n';
import { config } from '@grafana/runtime';
import { Badge, useTheme2 } from '@grafana/ui';
import { bp } from '@grafana/ui/stylex/constants.stylex';
import { colors, shadows, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

import { getLatestCompatibleVersion, shouldDisablePluginInstall } from '../helpers';
import { type CatalogPlugin, PluginUpdateStrategy, type Version } from '../types';

import { VersionInstallButton } from './VersionInstallButton';

interface Props {
  plugin: CatalogPlugin;
}

export const VersionList = ({ plugin }: Props) => {
  const theme = useTheme2();
  const oddRowBackground = theme.colors.emphasize(theme.colors.background.primary, 0.02);
  const pluginId = plugin.id;
  const versions = useMemo(() => plugin.details?.versions ?? [], [plugin.details?.versions]);
  const installedVersion = plugin.installedVersion;
  const disableInstallation = useMemo(() => shouldDisablePluginInstall(plugin), [plugin]);

  const latestCompatibleVersion = getLatestCompatibleVersion(versions);
  const latestMajorVersions = getLatestMajorVersions(versions);

  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    setIsInstalling(false);
  }, [installedVersion]);

  // Check if installed version is in the versions list
  const isInstalledVersionMissing = useMemo(() => {
    if (!installedVersion) {
      return false;
    }
    return !versions.some((v) => v.version === installedVersion);
  }, [versions, installedVersion]);

  if (versions.length === 0 && !isInstalledVersionMissing) {
    return (
      <p>
        <Trans i18nKey="plugins.version-list.no-version-history-was-found">No version history was found.</Trans>
      </p>
    );
  }

  const onInstallClick = () => {
    setIsInstalling(true);
  };

  return (
    <table {...stylex.props(styles.table)}>
      <thead {...stylex.props(styles.thead)}>
        <tr>
          <th {...stylex.props(styles.th)}>
            <Trans i18nKey="plugins.version-list.version">Version</Trans>
          </th>
          <th {...stylex.props(styles.th)}></th>
          <th {...stylex.props(styles.th)}>
            <Trans i18nKey="plugins.version-list.latest-release-date">Latest release date</Trans>
          </th>
          <th {...stylex.props(styles.th)}>
            <Trans i18nKey="plugins.version-list.grafana-dependency">Grafana dependency</Trans>
          </th>
        </tr>
      </thead>
      <tbody {...stylex.props(styles.tbody)}>
        {versions.map((version) => {
          let tooltip: string | undefined = undefined;
          const isInstalledVersion = installedVersion === version.version;

          if (version.angularDetected) {
            tooltip = 'This plugin version is AngularJS type which is not supported';
          }

          if (!version.isCompatible) {
            tooltip = 'This plugin version is not compatible with the current Grafana version';
          }

          if (disableInstallation) {
            tooltip = `This plugin can't be managed through the Plugin Catalog`;
          }

          return (
            <tr key={version.version} {...stylex.props(styles.row, styles.rowBackground(oddRowBackground))}>
              {/* Version number */}
              {isInstalledVersion ? (
                <td {...stylex.props(styles.td, styles.cardLabel, styles.versionCell, styles.currentVersion)}>
                  <Trans i18nKey="plugins.version-list.installed-version" values={{ versionNumber: version.version }}>
                    {'{{versionNumber}}'} (installed version)
                  </Trans>
                </td>
              ) : version.version === latestCompatibleVersion?.version ? (
                <td {...stylex.props(styles.td, styles.cardLabel, styles.versionCell)}>
                  <Trans
                    i18nKey="plugins.version-list.latest-compatible-version"
                    values={{ versionNumber: version.version }}
                  >
                    {'{{versionNumber}}'} (latest compatible version)
                  </Trans>
                </td>
              ) : (
                <td {...stylex.props(styles.td, styles.cardLabel, styles.versionCell)}>{version.version}</td>
              )}

              {/* Install button or status badge */}
              <td {...stylex.props(styles.td, styles.cardLabel, styles.actionCell)}>
                {isInstalledVersion && version.status === 'deprecated' ? (
                  <Badge text={t('plugins.version-list.deprecated', 'Deprecated')} color="orange" />
                ) : (
                  <VersionInstallButton
                    pluginId={pluginId}
                    version={version}
                    latestCompatibleVersion={latestCompatibleVersion?.version}
                    installedVersion={installedVersion}
                    onConfirmInstallation={onInstallClick}
                    disabled={
                      isInstalledVersion ||
                      isInstalling ||
                      version.angularDetected ||
                      !version.isCompatible ||
                      disableInstallation ||
                      shouldDisableVersionInstallation({
                        version,
                        latestMajorVersions,
                        installedVersion,
                        updateStrategy: plugin.managed.strategy,
                      })
                    }
                    tooltip={tooltip}
                  />
                )}
              </td>

              {/* Latest release date */}
              <td
                {...stylex.props(
                  styles.td,
                  styles.cardLabel,
                  styles.releaseDateCell,
                  isInstalledVersion && styles.currentVersion
                )}
              >
                {dateTimeFormatTimeAgo(version.updatedAt || version.createdAt)}
              </td>
              {/* Dependency */}
              <td
                {...stylex.props(
                  styles.td,
                  styles.cardLabel,
                  styles.dependencyCell,
                  isInstalledVersion && styles.currentVersion
                )}
              >
                {version.grafanaDependency || 'N/A'}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

interface ShouldDisableVersionInstallationArgs {
  version: Version;
  latestMajorVersions: Set<string>;
  installedVersion: string | undefined;
  updateStrategy?: PluginUpdateStrategy;
}

function shouldDisableVersionInstallation({
  version,
  latestMajorVersions,
  installedVersion,
  updateStrategy,
}: ShouldDisableVersionInstallationArgs) {
  if (!config.pluginAdminExternalManageEnabled) {
    return false;
  }

  if (updateStrategy === PluginUpdateStrategy.MajorAligned) {
    const lessThanInstalledVersion = installedVersion && lte(version.version, installedVersion);
    const isLatestMajorVersion = latestMajorVersions.has(version.version);

    // should disable the install when the version is lower than the current installed
    // or when the version is not among the latest major versions
    return lessThanInstalledVersion || !isLatestMajorVersion;
  }

  if (updateStrategy === PluginUpdateStrategy.Assigned) {
    return true;
  }

  return false;
}

/**
 * getLatestMajorVersions gets the latest versions for a given array of versions.
 * It will return a set of versions where each version is the latest version for its major version.
 * @param versions - array containing multiple versions with the same major and multiple major
 * @returns set of latest versions
 */
export function getLatestMajorVersions(versions: Version[]) {
  if (versions.length === 0) {
    return new Set<string>();
  }

  const latestVersions: string[] = [];
  const pureVersions = versions.map((v) => v.version);
  const sortedVersions = pureVersions.sort((a, b) => compare(a, b));

  let currentLatest = sortedVersions[0];
  let index = 1;

  do {
    while (index < sortedVersions.length && major(sortedVersions[index]) === major(currentLatest)) {
      currentLatest = sortedVersions[index];
      index++;
    }
    latestVersions.push(currentLatest);
    currentLatest = sortedVersions[index];
  } while (index < sortedVersions.length);

  return new Set(latestVersions);
}

const styles = stylex.create({
  currentVersion: { fontWeight: typography['--gf-typography-font-weight-bold'] },
  table: {
    tableLayout: { default: 'fixed', [bp.mdDown]: 'auto' },
    width: '100%',
  },
  thead: {
    display: { default: null, [bp.mdDown]: 'none' },
  },
  th: {
    paddingTop: spacing['--gf-spacing-x1'],
    paddingRight: 0,
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: 0,
    fontSize: typography['--gf-typography-h5-font-size'],
  },
  tbody: {
    display: { default: null, [bp.mdDown]: 'block' },
  },
  row: {
    display: { default: null, [bp.mdDown]: 'block' },
    marginBottom: { default: null, [bp.mdDown]: spacing['--gf-spacing-x2'] },
    paddingTop: { default: null, [bp.mdDown]: spacing['--gf-spacing-x2'] },
    paddingRight: { default: null, [bp.mdDown]: spacing['--gf-spacing-x2'] },
    paddingBottom: { default: null, [bp.mdDown]: spacing['--gf-spacing-x2'] },
    paddingLeft: { default: null, [bp.mdDown]: spacing['--gf-spacing-x2'] },
    borderWidth: { default: null, [bp.mdDown]: '1px' },
    borderStyle: { default: null, [bp.mdDown]: 'solid' },
    borderColor: { default: null, [bp.mdDown]: colors['--gf-colors-border-weak'] },
    borderRadius: { default: null, [bp.mdDown]: shape['--gf-shape-radius-default'] },
    boxShadow: { default: null, [bp.mdDown]: shadows['--gf-shadows-z1'] },
  },
  // The odd-row stripe beat the card background on narrow screens too (higher specificity).
  rowBackground: (odd: string) => ({
    backgroundColor: {
      default: null,
      ':nth-child(odd)': odd,
      [bp.mdDown]: { default: colors['--gf-colors-background-primary'], ':nth-child(odd)': odd },
    },
  }),
  td: {
    display: { default: null, [bp.mdDown]: 'block' },
    paddingTop: { default: spacing['--gf-spacing-x1'], [bp.mdDown]: spacing['--gf-spacing-x0-5'] },
    paddingRight: 0,
    paddingBottom: { default: spacing['--gf-spacing-x1'], [bp.mdDown]: spacing['--gf-spacing-x0-5'] },
    paddingLeft: 0,
    wordBreak: 'break-word',
    borderBottomWidth: { default: null, [bp.mdDown]: '1px' },
    borderBottomStyle: { default: null, [bp.mdDown]: { default: 'solid', ':last-child': 'none' } },
    borderBottomColor: { default: null, [bp.mdDown]: colors['--gf-colors-border-weak'] },
    textAlign: { default: null, [bp.mdDown]: 'left' },
  },
  // Narrow screens display the table as cards, with a label before each cell.
  cardLabel: {
    '::before': {
      display: { default: null, [bp.mdDown]: 'inline-block' },
      fontWeight: { default: null, [bp.mdDown]: typography['--gf-typography-font-weight-medium'] },
      color: { default: null, [bp.mdDown]: colors['--gf-colors-text-secondary'] },
      fontSize: { default: null, [bp.mdDown]: typography['--gf-typography-size-sm'] },
      marginRight: { default: null, [bp.mdDown]: spacing['--gf-spacing-x1'] },
      minWidth: { default: null, [bp.mdDown]: '120px' },
    },
  },
  versionCell: { '::before': { content: { default: null, [bp.mdDown]: '"Version:"' } } },
  actionCell: { '::before': { content: { default: null, [bp.mdDown]: '"Action:"' } } },
  releaseDateCell: { '::before': { content: { default: null, [bp.mdDown]: '"Release date:"' } } },
  dependencyCell: { '::before': { content: { default: null, [bp.mdDown]: '"Dependency:"' } } },
});
