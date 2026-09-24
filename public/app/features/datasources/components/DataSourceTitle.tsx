
import { } from '@grafana/ui';

interface Props {
  title: string;
}

export function DataSourceTitle({ title }: Props) {
  const styles = (getStyles);

  return (
    <div {...stylex.props(dataSourceTitleStyles.container)}>
      <h1 {...stylex.props(dataSourceTitleStyles.title)}>{title}</h1>
    </div>
  );
}

;
