import * as stylex from '@stylexjs/stylex';

import { cssVar } from '../../themes/stylex/cssVar';
import { spacingToken } from '../../themes/stylex/spacingTokens';

export const fieldLinkListStyles = stylex.create({
  wrapper: {
    flexBasis: '150px',
        width: '100px',
        marginTop: spacingToken(1),
  },
  externalLinksHeading: {
    color: cssVar('colors.text.secondary'),
        fontWeight: cssVar('typography.fontWeightRegular'),
        fontSize: cssVar('typography.size.sm'),
        margin: 0,
  },
  externalLink: {
    color: cssVar('colors.text.link'),
        fontWeight: cssVar('typography.fontWeightRegular'),
        display: 'block',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    
        ':hover': {
          textDecoration: 'underline',
        },
    
        div: {
          marginRight: spacingToken(1),
        },
  },
});

export function fieldLinkListStyleProps(key: keyof typeof fieldLinkListStyles) {
  return stylex.props(fieldLinkListStyles[key]);
}
