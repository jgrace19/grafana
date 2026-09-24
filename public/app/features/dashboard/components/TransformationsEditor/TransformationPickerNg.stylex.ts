import * as stylex from '@stylexjs/stylex';

import { themeSpacing } from '../../../../core/stylex/spacing';

export const transformationPickerNgStyles = stylex.create({
  pickerInformationLine: {
    fontSize: '16px',
    marginBottom: themeSpacing(2),
  },
  pickerInformationLineHighlight: {
    verticalAlign: 'middle',
  },
  searchWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    columnGap: themeSpacing(2),
    rowGap: themeSpacing(1),
    width: '100%',
    paddingBottom: themeSpacing(1),
  },
  searchInput: {
    flexGrow: '1',
    width: 'initial',
  },
  switchLabel: {
    whiteSpace: 'nowrap',
  },
});
