import * as stylex from '@stylexjs/stylex';

import { Spinner } from '@grafana/ui';

// ideally we'd use `@grafana/ui/LoadingPlaceholder`, but that
// one has a large margin-bottom.
type Props = {
  adjective?: string;
};

export const LoadingIndicator = ({ adjective = 'newer' }: Props) => {
  const text = `Loading ${adjective} logs...`;
  return (
    <div {...stylex.props(styles.loadingIndicator)}>
      <div>
        {text} <Spinner inline />
      </div>
    </div>
  );
};

const styles = stylex.create({
  loadingIndicator: {
    display: 'flex',
    justifyContent: 'center',
  },
});
