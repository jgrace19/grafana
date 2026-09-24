import * as stylex from '@stylexjs/stylex';

import { spacingToken } from '../../../themes/stylex/spacingTokens';

export const dataLinksInlineEditorBaseStyles = stylex.create({
  container: {
    position: 'relative',
  },
  wrapper: {
    marginBottom: spacingToken(2),
        display: 'flex',
        flexDirection: 'column',
  },
  button: {
    marginLeft: spacingToken(1),
  },
});

export function dataLinksInlineEditorBaseStyleProps(key: keyof typeof dataLinksInlineEditorBaseStyles) {
  return stylex.props(dataLinksInlineEditorBaseStyles[key]);
}
