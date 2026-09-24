import * as stylex from '@stylexjs/stylex';

import { spacing } from '@grafana/ui/stylex/tokens.stylex';

interface Props {
  title: string;
}

export function DataSourceTitle({ title }: Props) {
  return (
    <div {...stylex.props(styles.container)}>
      <h1 {...stylex.props(styles.title)}>{title}</h1>
    </div>
  );
}

const styles = stylex.create({
  container: {
    marginBottom: spacing['--gf-spacing-x2'],
  },
  title: {
    display: 'inline-block',
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    maxWidth: '40vw',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
});
