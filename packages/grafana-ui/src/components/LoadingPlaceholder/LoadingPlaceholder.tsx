import * as stylex from '@stylexjs/stylex';
import { type HTMLAttributes } from 'react';
import * as React from 'react';

import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { spacing } from '../../themes/stylex/tokens.stylex';
import { Spinner } from '../Spinner/Spinner';

/**
 * @public
 */
export interface LoadingPlaceholderProps extends HTMLAttributes<HTMLDivElement> {
  text: React.ReactNode;
  /** @internal first-party StyleX overrides, applied last */
  xstyle?: stylex.StyleXStyles;
}

/**
 * Loading indicator with a text. Used to alert a user to wait for an activity to complete.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/information-loadingplaceholder--docs
 * @public
 */
export const LoadingPlaceholder = ({ text, className, style, xstyle, ...rest }: LoadingPlaceholderProps) => {
  return (
    <div {...mergeStylexProps(stylex.props(styles.container, xstyle), { className, style })} {...rest}>
      {text} <Spinner inline={true} />
    </div>
  );
};

const styles = stylex.create({
  container: {
    marginBottom: spacing['--gf-spacing-x4'],
  },
});
