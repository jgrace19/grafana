import * as stylex from '@stylexjs/stylex';

import { cssVar } from '../../themes/stylex/cssVar';

export const buttonGroupStyles = stylex.create({
  wrapper: {
    display: 'flex',
        borderRadius: cssVar('shape.radius.default'),
    
        '> .button-group:not(:first-child) > button, > button:not(:first-child)': {
          borderTopLeftRadius: 'unset',
          borderBottomLeftRadius: 'unset',
          borderLeft: `1px solid rgba(255, 255, 255, 0.12)`,
        },
    
        '> .button-group:not(:last-child) > button, > button:not(:last-child)': {
          borderTopRightRadius: 'unset',
          borderBottomRightRadius: 'unset',
          borderRight: `1px solid rgba(0, 0, 0, 0.12)`,
        },
  },
});

export function buttonGroupStyleProps(key: keyof typeof buttonGroupStyles) {
  return stylex.props(buttonGroupStyles[key]);
}
