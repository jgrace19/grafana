import * as stylex from '@stylexjs/stylex';

import { cssVar } from '../../themes/stylex/cssVar';

export const portalStyles = stylex.create({
  grafanaPortalContainer: {
    position: 'fixed',
          top: 0,
          width: '100%',
          zIndex: cssVar('zIndex.portal'),
  },
});

export function portalStyleProps(key: keyof typeof portalStyles) {
  return stylex.props(portalStyles[key]);
}
