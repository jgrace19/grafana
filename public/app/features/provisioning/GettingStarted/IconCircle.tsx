import * as stylex from '@stylexjs/stylex';

import { colorManipulator } from '@grafana/data';
import { Icon, type IconName, useTheme2 } from '@grafana/ui';
import { mergeStylexClassName } from '@grafana/ui/unstable';

import { iconCircleStyles } from './IconCircle.stylex';

export interface IconCircleProps {
  icon: IconName;
  color: 'blue' | 'orange' | 'purple';
}

export const IconCircle = ({ icon, color }: IconCircleProps) => {
  const theme = useTheme2();
  const resolvedColor = theme.visualization.getColorByName(color);
  const className = mergeStylexClassName(
    stylex.props(iconCircleStyles.iconCircle, {
      color: resolvedColor,
      backgroundColor: colorManipulator.alpha(resolvedColor, 0.2),
    }),
    undefined
  ).className;

  return (
    <div className={className}>
      <Icon name={icon} size="xl" />
    </div>
  );
};
