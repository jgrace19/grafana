import * as stylex from '@stylexjs/stylex';

import { Icon } from '@grafana/ui';

import { type RepoType } from '../Wizard/types';
import { getRepositoryTypeConfig } from '../utils/repositoryTypes';

export function RepoIcon({ type }: { type: RepoType | undefined }) {
  const config = type ? getRepositoryTypeConfig(type) : undefined;

  if (!config) {
    return <Icon name="database" size="xxl" />;
  }
  return (
    <>
      {config.logo ? (
        <img src={config.logo} alt={config.label} {...stylex.props(styles.logo)} />
      ) : (
        <Icon name={config.icon} size="xxl" />
      )}
    </>
  );
}

const styles = stylex.create({
  // getSvgSize('xxl')
  logo: {
    width: 36,
    height: 36,
  },
});
