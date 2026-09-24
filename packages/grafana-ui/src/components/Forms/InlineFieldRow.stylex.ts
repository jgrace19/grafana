import * as stylex from '@stylexjs/stylex';

import { spacingToken } from '../../themes/stylex/spacingTokens';

export const inlineFieldRowStyles = stylex.create({
  container: {
    label: 'InlineFieldRow',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignContent: 'flex-start',
          rowGap: spacingToken(0.5),
  },
});

export function inlineFieldRowStyleProps(key: keyof typeof inlineFieldRowStyles) {
  return stylex.props(inlineFieldRowStyles[key]);
}
