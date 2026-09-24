import * as stylex from '@stylexjs/stylex';

import { type ThemeSpacingTokens } from '@grafana/data';

import { grafanaTokens } from '../../themes/stylex/tokens.generated.stylex';
import { spacingToken } from '../../themes/stylex/spacingTokens';

export const dividerStyles = stylex.create({
  horizontalDivider: {
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: grafanaTokens.colors_border_weak,
    width: '100%',
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginLeft: 0,
    marginRight: 0,
  },
  verticalDivider: {
    borderRightWidth: '1px',
    borderRightStyle: 'solid',
    borderRightColor: grafanaTokens.colors_border_weak,
    height: '100%',
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    marginTop: 0,
    marginBottom: 0,
  },
});

const horizontalMarginKeys = [0, 0.25, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10] as const;
const horizontalMarginStyles = stylex.create(
  Object.fromEntries(
    horizontalMarginKeys.map((token) => [
      `h${String(token).replace('.', '_')}`,
      {
        marginTop: spacingToken(token as ThemeSpacingTokens),
        marginBottom: spacingToken(token as ThemeSpacingTokens),
      },
    ])
  )
);

const verticalMarginStyles = stylex.create(
  Object.fromEntries(
    horizontalMarginKeys.map((token) => [
      `v${String(token).replace('.', '_')}`,
      {
        marginLeft: spacingToken(token as ThemeSpacingTokens),
        marginRight: spacingToken(token as ThemeSpacingTokens),
      },
    ])
  )
);

function marginKey(token: ThemeSpacingTokens, prefix: 'h' | 'v') {
  return `${prefix}${String(token).replace('.', '_')}` as keyof typeof horizontalMarginStyles;
}

export function dividerStyleProps(direction: 'vertical' | 'horizontal', spacing: ThemeSpacingTokens) {
  if (direction === 'vertical') {
    return stylex.props(
      dividerStyles.verticalDivider,
      verticalMarginStyles[marginKey(spacing, 'v') as keyof typeof verticalMarginStyles]
    );
  }
  return stylex.props(
    dividerStyles.horizontalDivider,
    horizontalMarginStyles[marginKey(spacing, 'h') as keyof typeof horizontalMarginStyles]
  );
}
