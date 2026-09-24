import { autoUpdate, offset, type Side, useFloating, useTransitionStyles } from '@floating-ui/react';
import * as stylex from '@stylexjs/stylex';
import { useLayoutEffect } from 'react';
import * as React from 'react';

import { type GrafanaTheme2 } from '@grafana/data';

import { useTheme2 } from '../../themes/ThemeContext';
import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { components, shape, spacing } from '../../themes/stylex/tokens.stylex';
import { type IconName } from '../../types/icon';
import { getPositioningMiddleware } from '../../utils/floating';
import { Icon } from '../Icon/Icon';
import { Portal } from '../Portal/Portal';
import { textVariantStyles } from '../Text/Text';

export interface InlineToastProps {
  children: React.ReactNode;
  suffixIcon?: IconName;
  referenceElement: HTMLElement | null;
  placement: Side;
  /**
   * @deprecated
   * Placement to use if there is not enough space to show the full toast with the original placement
   * This is now done automatically.
   */
  alternativePlacement?: Side;
}

/**
 * Used to indicate temporal status near fields/components, such as a *Saved* indicator next to a field, or a little *Copied!* indicator above a button.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/information-inlinetoast--docs
 */
export function InlineToast({ referenceElement, children, suffixIcon, placement }: InlineToastProps) {
  const theme = useTheme2();

  // the order of middleware is important!
  // `arrow` should almost always be at the end
  // see https://floating-ui.com/docs/arrow#order
  const middleware = [offset(8), ...getPositioningMiddleware(placement)];

  const { context, refs, floatingStyles } = useFloating({
    open: true,
    placement,
    middleware,
    whileElementsMounted: autoUpdate,
    strategy: 'fixed',
  });

  useLayoutEffect(() => {
    refs.setReference(referenceElement);
  }, [referenceElement, refs]);

  const { styles: placementStyles } = useTransitionStyles(context, {
    initial: ({ side }) => {
      return {
        opacity: 0,
        transform: getInitialTransform(side, theme),
      };
    },
    duration: theme.transitions.duration.shortest,
  });

  return (
    <Portal>
      <div style={{ display: 'inline-block', ...floatingStyles }} ref={refs.setFloating} aria-live="polite">
        <span {...mergeStylexProps(stylex.props(textVariantStyles.bodySmall, styles.root), { style: placementStyles })}>
          {children && <span>{children}</span>}
          {suffixIcon && <Icon name={suffixIcon} />}
        </span>
      </div>
    </Portal>
  );
}

const getInitialTransform = (placement: InlineToastProps['placement'], theme: GrafanaTheme2) => {
  const gap = 1;

  switch (placement) {
    case 'top':
      return `translateY(${theme.spacing(gap)})`;
    case 'bottom':
      return `translateY(-${theme.spacing(gap)})`;
    case 'left':
      return `translateX(${theme.spacing(gap)})`;
    case 'right':
      return `translateX(-${theme.spacing(gap)})`;
  }
};

const styles = stylex.create({
  root: {
    willChange: 'transform',
    backgroundColor: components['--gf-components-tooltip-background'],
    color: components['--gf-components-tooltip-text'],
    // gets an extra .5 of vertical padding to account for the rounded corners
    paddingTop: spacing['--gf-spacing-x0-5'],
    paddingRight: spacing['--gf-spacing-x1-5'],
    paddingBottom: spacing['--gf-spacing-x0-5'],
    paddingLeft: spacing['--gf-spacing-x1-5'],
    borderRadius: shape['--gf-shape-radius-pill'],
    display: 'inline-flex',
    gap: spacing['--gf-spacing-x0-5'],
    alignItems: 'center',
  },
});
