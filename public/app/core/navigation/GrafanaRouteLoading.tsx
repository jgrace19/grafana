import * as stylex from '@stylexjs/stylex';

import { BouncingLoader } from '../components/BouncingLoader/BouncingLoader';

import { grafanaRouteLoadingStyles } from './GrafanaRouteLoading.stylex';

export function GrafanaRouteLoading() {

  return (
    <div {...stylex.props(grafanaRouteLoadingStyles.loadingPage)}>
      <BouncingLoader />
    </div>
  );
}

