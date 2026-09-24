import * as stylex from '@stylexjs/stylex';

import { type IconName } from '@grafana/data';
import { Icon } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

type Props = { iconName: IconName; label: string };

export const CategoryHeader = ({ iconName, label }: Props) => {
  return (
    <div {...stylex.props(styles.categoryHeader)}>
      <Icon name={iconName} size="xl" />
      <h3 {...stylex.props(styles.categoryLabel)}>{label}</h3>
    </div>
  );
};

const styles = stylex.create({
  categoryHeader: {
    alignItems: 'center',
    display: 'flex',
    marginBottom: spacing['--gf-spacing-x3'],
  },
  categoryLabel: {
    marginBottom: 0,
    marginLeft: spacing['--gf-spacing-x1'],
  },
});
