
import { Icon, } from '@grafana/ui';
import { getSvgSize } from '@grafana/ui/internal';

import { type RepoType } from '../Wizard/types';
import { getRepositoryTypeConfig } from '../utils/repositoryTypes';

export function RepoIcon({ type }: { type: RepoType | undefined }) {
  const styles = (getStyles);
  const config = type ? getRepositoryTypeConfig(type) : undefined;

  if (!config) {
    return <Icon name="database" size="xxl" />;
  }
  return (
    <>
      {config.logo ? (
        <img src={config.logo} alt={config.label} {...stylex.props(repoIconStyles.logo)} />
      ) : (
        <Icon name={config.icon} size="xxl" />
      )}
    </>
  );
}

