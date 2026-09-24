import * as stylex from '@stylexjs/stylex';

import { colors } from '@grafana/ui/stylex/tokens.stylex';

import { BouncingLoader } from '../components/BouncingLoader/BouncingLoader';

export function GrafanaRouteLoading() {
  return (
    <div {...stylex.props(styles.loadingPage)}>
      <BouncingLoader />
    </div>
  );
}

const styles = stylex.create({
  loadingPage: {
    backgroundColor: colors['--gf-colors-background-primary'],
    flex: '1',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
