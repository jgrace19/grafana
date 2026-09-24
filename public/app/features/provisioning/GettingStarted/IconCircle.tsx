import * as stylex from '@stylexjs/stylex';

import { colorManipulator } from '@grafana/data';
import { Icon, type IconName, useTheme2 } from '@grafana/ui';
import { shape, spacing } from '@grafana/ui/stylex/tokens.stylex';

export interface IconCircleProps {
  icon: IconName;
  color: 'blue' | 'orange' | 'purple';
}

export const IconCircle = ({ icon, color }: IconCircleProps) => {
  const theme = useTheme2();
  const resolvedColor = theme.visualization.getColorByName(color);

  return (
    <div {...stylex.props(styles.iconCircle, styles.colors(resolvedColor, colorManipulator.alpha(resolvedColor, 0.2)))}>
      <Icon name={icon} size="xl" />
    </div>
  );
};

const styles = stylex.create({
  iconCircle: {
    borderRadius: shape['--gf-shape-radius-circle'],
    paddingTop: spacing['--gf-spacing-x1'],
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: spacing['--gf-spacing-x1'],
  },
  colors: (color: string, backgroundColor: string) => ({
    color,
    backgroundColor,
  }),
});
