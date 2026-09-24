import * as stylex from '@stylexjs/stylex';

import { colors, typography } from '@grafana/ui/stylex/tokens.stylex';

// Text component doesn't let us use strikethrough so we use a span with the correct style instead
export const CardTitle = ({ title, isHidden }: { title: string; isHidden: boolean }) => {
  return <span {...stylex.props(styles.title, isHidden && styles.hidden)}>{title}</span>;
};

const styles = stylex.create({
  title: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    textDecoration: 'none',
    color: colors['--gf-colors-text-primary'],
    fontFamily: typography['--gf-typography-code-font-family'],
    fontSize: typography['--gf-typography-code-font-size'],
    lineHeight: typography['--gf-typography-code-line-height'],
    letterSpacing: typography['--gf-typography-code-letter-spacing'],
    fontWeight: typography['--gf-typography-font-weight-light'],
  },
  hidden: {
    textDecoration: 'line-through',
  },
});
