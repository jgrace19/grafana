import * as stylex from '@stylexjs/stylex';

import { cssVar } from '../../../themes/stylex/cssVar';

export const timeZoneOptionStyles = stylex.create({
  container: {
    display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        flexShrink: 0,
        whiteSpace: 'nowrap',
        cursor: 'pointer',
        padding: '6px 8px 4px',
    
        ':hover': {
          background: cssVar('colors.action.hover'),
        },
  },
  containerFocused: {
    background: cssVar('colors.action.hover'),
  },
  body: {
    display: 'flex',
        fontWeight: cssVar('typography.fontWeightMedium'),
        flexDirection: 'column',
        flexGrow: 1,
  },
  row: {
    display: 'flex',
        flexDirection: 'row',
  },
  leftColumn: {
    flexGrow: 1,
        textOverflow: 'ellipsis',
  },
  rightColumn: {
    justifyContent: 'flex-end',
        alignItems: 'center',
  },
  wideRow: {
    display: 'flex',
        flexDirection: 'row',
        alignItems: 'baseline',
  },
  spacer: {
    marginLeft: '6px',
  },
});

export function timeZoneOptionStyleProps(key: keyof typeof timeZoneOptionStyles) {
  return stylex.props(timeZoneOptionStyles[key]);
}
