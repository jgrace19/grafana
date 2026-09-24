import * as stylex from '@stylexjs/stylex';
import { type HTMLAttributes } from 'react';

import { Icon } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { colors, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

import './OrangeBadge.css';

interface Props extends HTMLAttributes<HTMLDivElement> {
  text?: string;
  className?: string;
}

export function OrangeBadge({ text, className, style, ...htmlProps }: Props) {
  return (
    <div {...mergeStylexProps(stylex.props(styles.wrapper), { className, style })} {...htmlProps}>
      <Icon name="cloud" size="sm" className={text === undefined ? 'gf-orange-badge-icon-only' : undefined} />
      {text}
    </div>
  );
}

const styles = stylex.create({
  wrapper: {
    display: 'inline-flex',
    paddingTop: spacing['--gf-spacing-x0-5'],
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x0-5'],
    paddingLeft: spacing['--gf-spacing-x1'],
    borderRadius: shape['--gf-shape-radius-pill'],
    backgroundImage: colors['--gf-colors-gradients-brand-horizontal'],
    color: colors['--gf-colors-primary-contrast-text'],
    fontWeight: typography['--gf-typography-font-weight-medium'],
    gap: spacing['--gf-spacing-x0-5'],
    fontSize: typography['--gf-typography-body-small-font-size'],
    lineHeight: typography['--gf-typography-body-small-line-height'],
    alignItems: 'center',
  },
});
