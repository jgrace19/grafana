
import { Icon, } from '@grafana/ui';


type Props = { iconName: IconName; label: string };

export const CategoryHeader = ({ iconName, label }: Props) => {
  const styles = (getStyles);
  return (
    <div {...stylex.props(categoryHeaderStyles.categoryHeader)}>
      <Icon name={iconName} size="xl" />
      <h3 {...stylex.props(categoryHeaderStyles.categoryLabel)}>{label}</h3>
    </div>
  );
};
