import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../stylex/spacing';

export const editableTitleStyles = stylex.create({
  textContainer: {
    minWidth: 0,
  },
  field: {
    flex: 1,
          // magic number here to ensure the input text lines up exactly with the h1 text
          // input has a 1px border + themeSpacing(1) padding so we need to offset that
          left: `calc(-${themeSpacing(1)} - 1px)`,
          position: 'relative',
          marginBottom: 0,
  },
  input: {
    input: {
            .../* UNMAPPED theme.typography.h1 */ 'inherit',
          },
  },
  inputContainer: {
    display: 'flex',
          flex: 1,
  },
  textWrapper: {
    alignItems: 'center',
          display: 'flex',
          gap: themeSpacing(1),
          height: themeSpacing(theme.components.height.md),
  },
});
