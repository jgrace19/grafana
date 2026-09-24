import * as stylex from '@stylexjs/stylex';

import { cssVar, cssVarSpacing } from '../../themes/stylex/cssVar';
import { spacingToken } from '../../themes/stylex/spacingTokens';

export const facetedLabelsFilterStyles = stylex.create({
  container: {
    display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        minWidth: '150px',
        padding: cssVarSpacing(1.5, 1, 1, 1),
        gap: spacingToken(1),
  },
  dimmed: {
    opacity: 0.5,
  },
  section: {
    display: 'flex',
        flexDirection: 'column',
  },
  sectionLabel: {
    fontSize: cssVar('typography.bodySmall.fontSize'),
        fontWeight: cssVar('typography.fontWeightMedium'),
        color: cssVar('colors.text.secondary'),
        marginBottom: spacingToken(0.25),
  },
  toggleAll: {
    all: 'unset',
        cursor: 'pointer',
        fontSize: cssVar('typography.bodySmall.fontSize'),
        color: cssVar('colors.text.link'),
        marginTop: spacingToken(0.25),
        ':hover': {
          textDecoration: 'underline',
        },
  },
  labelGroup: {
    display: 'flex',
        flexDirection: 'column',
  },
  labelKey: {
    all: 'unset',
        display: 'flex',
        alignItems: 'center',
        gap: spacingToken(0.5),
        cursor: 'pointer',
        padding: cssVarSpacing(0.25, 0),
        fontSize: cssVar('typography.bodySmall.fontSize'),
        color: cssVar('colors.text.primary'),
        ':hover': {
          color: cssVar('colors.text.maxContrast'),
        },
  },
  keyName: {
    fontWeight: cssVar('typography.fontWeightMedium'),
        fontFamily: cssVar('typography.fontFamilyMonospace'),
  },
  count: {
    fontSize: cssVar('typography.bodySmall.fontSize'),
        color: cssVar('colors.primary.text'),
        fontWeight: cssVar('typography.fontWeightMedium'),
  },
  checkboxList: {
    display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: spacingToken(0.25),
        padding: cssVarSpacing(0, 0, 0.5, 0.5),
  },
  checkboxListIndented: {
    display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: spacingToken(0.25),
        padding: cssVarSpacing(0, 0, 0.5, 2.5),
  },
  checkbox: {
    fontSize: cssVar('typography.bodySmall.fontSize'),
        fontFamily: cssVar('typography.fontFamilyMonospace'),
  },
});

export function facetedLabelsFilterStyleProps(key: keyof typeof facetedLabelsFilterStyles) {
  return stylex.props(facetedLabelsFilterStyles[key]);
}
