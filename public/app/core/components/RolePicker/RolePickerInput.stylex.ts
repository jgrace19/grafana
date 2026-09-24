import * as stylex from '@stylexjs/stylex';

import { themeSpacing } from '../../stylex/spacing';

export const rolePickerInputStyles = stylex.create({
  wrapperLayout: {
    minHeight: '32px',
    maxHeight: '200px',
    overflow: 'scroll',
    overflowX: 'hidden',
    overflowY: 'auto',
    height: 'auto',
    flexDirection: 'row',
    paddingRight: themeSpacing(1),
    maxWidth: '100%',
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    position: 'relative',
    boxSizing: 'border-box',
    cursor: 'default',
  },
  wrapperWithPrefix: {
    paddingLeft: 0,
  },
  input: {
    maxWidth: '120px',
    borderWidth: 0,
    borderStyle: 'none',
  },
  inputFocused: {
    cursor: 'default',
  },
  inputBlurred: {
    cursor: 'pointer',
  },
  dropdownIndicator: {
    cursor: 'pointer',
  },
  selectedRoles: {
    display: 'flex',
    alignItems: 'center',
  },
  selectedRolesDisabled: {
    cursor: 'not-allowed',
  },
  selectedRolesEnabled: {
    cursor: 'pointer',
  },
  tooltip: {
    ' p': {
      marginBottom: themeSpacing(0.5),
    },
  },
  spinner: {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
});
