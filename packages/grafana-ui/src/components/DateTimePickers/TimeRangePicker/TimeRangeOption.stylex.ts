import * as stylex from '@stylexjs/stylex';

import { cssVar } from '../../../themes/stylex/cssVar';
import { spacingToken } from '../../../themes/stylex/spacingTokens';

export const timeRangeOptionStyles = stylex.create({
  container: {
    display: 'flex',
          alignItems: 'center',
          flexDirection: 'row-reverse',
          justifyContent: 'space-between',
          position: 'relative',
  },
  radio: {
    opacity: 0,
          width: '0 !important',
          '&:focus-visible + label': { outline: '2px dotted transparent', outlineOffset: '2px', boxShadow: `0 0 0 2px ${cssVar('colors.background.canvas')}, 0 0 0px 4px ${cssVar('colors.primary.main')}` },
  },
  label: {
    cursor: 'pointer',
          flex: 1,
          padding: spacingToken(1),
          borderRadius: cssVar('shape.radius.default'),
    
          ':hover': {
            background: cssVar('colors.action.hover'),
            cursor: 'pointer',
          },
  },
  labelSelected: {
    background: cssVar('colors.action.selected'),
    
          '::before': {
            backgroundImage: cssVar('colors.gradients.brandVertical'),
            borderRadius: cssVar('shape.radius.default'),
            content: '" "',
            display: 'block',
            height: '100%',
            position: 'absolute',
            width: spacingToken(0.5),
            left: 0,
            top: 0,
          },
  },
});

export function timeRangeOptionStyleProps(key: keyof typeof timeRangeOptionStyles) {
  return stylex.props(timeRangeOptionStyles[key]);
}
