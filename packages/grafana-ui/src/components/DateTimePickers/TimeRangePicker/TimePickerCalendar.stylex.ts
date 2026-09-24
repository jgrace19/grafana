import * as stylex from '@stylexjs/stylex';

import { cssVar } from '../../../themes/stylex/cssVar';
import { spacingToken } from '../../../themes/stylex/spacingTokens';

export const timePickerCalendarStyles = stylex.create({
  containerRight: {
    top: 0,
    position: 'absolute',
    right: '546px',
  },
  containerLeft: {
    top: 0,
    position: 'absolute',
    left: '546px',
  },
  modalContainer: {
    margin: '0 auto',
  },
  calendar: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacingToken(1),
    padding: spacingToken(1),
    boxShadow: cssVar('shadows.z3'),
    backgroundColor: cssVar('colors.background.elevated'),
    border: `1px solid ${cssVar('colors.border.weak')}`,
    borderRadius: cssVar('shape.radius.default'),
  },
  modal: {
    boxShadow: cssVar('shadows.z3'),
    left: '50%',
    position: 'fixed',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: cssVar('zIndex.modal'),
  },
});

export function timePickerCalendarStyleProps(key: keyof typeof timePickerCalendarStyles) {
  return stylex.props(timePickerCalendarStyles[key]);
}
