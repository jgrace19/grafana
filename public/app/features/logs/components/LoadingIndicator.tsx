import * as stylex from '@stylexjs/stylex';

import { Spinner } from '@grafana/ui';

import { loadingIndicatorStyles } from './LoadingIndicator.stylex';

// ideally we'd use `@grafana/ui/LoadingPlaceholder`, but that
// one has a large margin-bottom.
type Props = {
  adjective?: string;
};

export const LoadingIndicator = ({ adjective = 'newer' }: Props) => {
  const text = `Loading ${adjective} logs...`;
  return (
    <div {...stylex.props(loadingIndicatorStyles.root)}>
      <div>
        {text} <Spinner inline />
      </div>
    </div>
  );
};
