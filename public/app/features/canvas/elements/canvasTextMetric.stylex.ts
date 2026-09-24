import * as stylex from '@stylexjs/stylex';

import { themeSpacing } from '../../../core/stylex/spacing';

export const canvasTextMetricStyles = stylex.create({
  container: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    display: 'table',
  },
  inlineEditorContainer: {
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: themeSpacing(1),
  },
  span: {
    display: 'table-cell',
  },
});
