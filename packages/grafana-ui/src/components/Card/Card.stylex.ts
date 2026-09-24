import * as stylex from '@stylexjs/stylex';

import { cssVar, cssVarSpacing } from '../../themes/stylex/cssVar';
import { spacingToken } from '../../themes/stylex/spacingTokens';

const focusRing = {
  outline: '2px dotted transparent',
  outlineOffset: '2px',
  boxShadow: `0 0 0 2px ${cssVar('colors.background.canvas')}, 0 0 0px 4px ${cssVar('colors.primary.main')}`,
} as const;

export const cardStyles = stylex.create({
  heading: {
    gridArea: 'Heading',
    justifySelf: 'start',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 0,
    fontSize: cssVar('typography.size.md'),
    letterSpacing: 'inherit',
    lineHeight: cssVar('typography.body.lineHeight'),
    color: cssVar('colors.text.primary'),
    fontWeight: cssVar('typography.fontWeightMedium'),
    ' input[readonly]': {
      cursor: 'inherit',
    },
  },
  linkHack: {
    all: 'unset',
    '::after': {
      position: 'absolute',
      content: '""',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      borderRadius: cssVar('shape.radius.default'),
    },
    ':focus-visible': {
      outline: 'none',
      outlineOffset: 0,
      boxShadow: 'none',
      '::after': {
        ...focusRing,
        zIndex: 1,
      },
    },
  },
  tagList: {
    position: 'relative',
    gridArea: 'Tags',
    alignSelf: 'center',
  },
  description: {
    width: '100%',
    gridArea: 'Description',
    margin: cssVarSpacing(1, 0, 0),
    color: cssVar('colors.text.secondary'),
    lineHeight: cssVar('typography.body.lineHeight'),
  },
  media: {
    position: 'relative',
    gridArea: 'Figure',
    marginRight: spacingToken(2),
    width: '40px',
    ' > img': {
      width: '100%',
    },
    ':empty': {
      display: 'none',
    },
  },
  mediaAlignCenter: {
    alignSelf: 'center',
  },
  mediaAlignStart: {
    alignSelf: 'start',
  },
  metadata: {
    gridArea: 'Meta',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    fontSize: cssVar('typography.size.sm'),
    color: cssVar('colors.text.secondary'),
    margin: cssVarSpacing(0.5, 0, 0),
    lineHeight: cssVar('typography.bodySmall.lineHeight'),
    overflowWrap: 'anywhere',
  },
  metadataItem: {
    zIndex: 0,
  },
  separator: {
    margin: cssVarSpacing(0, 1),
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacingToken(1),
    gridArea: 'Actions',
    marginTop: spacingToken(2),
  },
  secondaryActions: {
    alignSelf: 'center',
    color: cssVar('colors.text.secondary'),
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacingToken(1),
    gridArea: 'Secondary',
    marginTop: spacingToken(2),
  },
  inner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    flexWrap: 'wrap',
  },
});

export function cardStyleProps(key: keyof typeof cardStyles) {
  return stylex.props(cardStyles[key]);
}
