import * as stylex from '@stylexjs/stylex';
import type { JSX } from 'react';

import { bp } from '../../themes/stylex/constants.stylex';
import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { colors, shape, spacing } from '../../themes/stylex/tokens.stylex';

export interface CallToActionCardProps {
  message?: string | JSX.Element;
  callToActionElement: JSX.Element;
  footer?: string | JSX.Element;
  className?: string;
}

/**
 * @deprecated Use `<EmptyState variant="call-to-action" />` instead.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/information-deprecated-calltoactioncard--docs
 */
export const CallToActionCard = ({ message, callToActionElement, footer, className }: CallToActionCardProps) => {
  return (
    <div {...mergeStylexProps(stylex.props(styles.wrapper), { className })}>
      {message && <div {...stylex.props(styles.message)}>{message}</div>}
      {callToActionElement}
      {footer && <div {...stylex.props(styles.footer)}>{footer}</div>}
    </div>
  );
};

const styles = stylex.create({
  wrapper: {
    backgroundColor: colors['--gf-colors-background-secondary'],
    borderRadius: shape['--gf-shape-radius-default'],
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
    paddingTop: spacing['--gf-spacing-x3'],
    paddingBottom: spacing['--gf-spacing-x3'],
    paddingLeft: { default: spacing['--gf-spacing-x3'], [bp.smDown]: spacing['--gf-spacing-x1'] },
    paddingRight: { default: spacing['--gf-spacing-x3'], [bp.smDown]: spacing['--gf-spacing-x1'] },
  },
  message: {
    marginBottom: spacing['--gf-spacing-x3'],
    fontStyle: 'italic',
  },
  footer: {
    marginTop: spacing['--gf-spacing-x3'],
  },
});
