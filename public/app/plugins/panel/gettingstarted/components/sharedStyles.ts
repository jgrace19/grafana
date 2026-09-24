import * as stylex from '@stylexjs/stylex';

import { bp } from '@grafana/ui/stylex/constants.stylex';
import { colors, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';

export const cardStyles = stylex.create({
  card: {
    backgroundColor: colors['--gf-colors-background-secondary'],
    marginRight: {
      default: spacing['--gf-spacing-x4'],
      [bp.xxlDown]: spacing['--gf-spacing-x2'],
    },
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-weak'],
    borderBottomLeftRadius: `calc(${shape['--gf-shape-radius-default']} * 2)`,
    borderBottomRightRadius: `calc(${shape['--gf-shape-radius-default']} * 2)`,
    position: 'relative',
    maxHeight: '230px',
    '::before': {
      display: 'block',
      content: "' '",
      position: 'absolute',
      left: 0,
      right: 0,
      height: '2px',
      top: 0,
    },
  },
  content: {
    padding: '16px',
  },
});

export const cardBorderStyles = stylex.create({
  complete: {
    '::before': { backgroundImage: 'linear-gradient(to right, #5182CC 0%, #245BAF 100%)' },
  },
  incompleteDark: {
    '::before': { backgroundImage: 'linear-gradient(to right, #f05a28 0%, #fbca0a 100%)' },
  },
  incompleteLight: {
    '::before': { backgroundImage: 'linear-gradient(to right, #FBCA0A 0%, #F05A28 100%)' },
  },
});

export function cardBorderStyle(isDark: boolean, complete: boolean) {
  if (complete) {
    return cardBorderStyles.complete;
  }
  return isDark ? cardBorderStyles.incompleteDark : cardBorderStyles.incompleteLight;
}
