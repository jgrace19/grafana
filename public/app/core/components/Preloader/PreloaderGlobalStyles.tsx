import { Global } from '@emotion/react';

import { useTheme2 } from '@grafana/ui';

import { getPreloaderRootStyles } from './preloader.styles';

export function PreloaderGlobalStyles() {
  const theme = useTheme2();
  return <Global styles={getPreloaderRootStyles(theme)} />;
}
