import * as stylex from '@stylexjs/stylex';

import { spacingToken } from '../../themes/stylex/spacingTokens';

export const reactMonacoEditorLazyStyles = stylex.create({
  container: {
    marginBottom: 'unset',
          marginLeft: spacingToken(1),
  },
});

export function reactMonacoEditorLazyStyleProps(key: keyof typeof reactMonacoEditorLazyStyles) {
  return stylex.props(reactMonacoEditorLazyStyles[key]);
}
