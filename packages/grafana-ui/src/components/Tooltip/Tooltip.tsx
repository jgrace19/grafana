import {
  arrow,
  autoUpdate,
  FloatingArrow,
  offset,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  safePolygon,
} from '@floating-ui/react';
import * as stylex from '@stylexjs/stylex';
import { forwardRef, cloneElement, isValidElement, useCallback, useId, useRef, useState, type JSX } from 'react';

import { selectors } from '@grafana/e2e-selectors';

import { colors, components, spacing } from '../../themes/stylex/tokens.stylex';
import { getPositioningMiddleware } from '../../utils/floating';
import { getPlacement, tooltipStyles } from '../../utils/tooltipUtils';
import { Portal } from '../Portal/Portal';

import { type PopoverContent, type TooltipPlacement } from './types';

export interface TooltipProps {
  theme?: 'info' | 'error' | 'info-alt';
  show?: boolean;
  placement?: TooltipPlacement;
  content: PopoverContent;
  children: JSX.Element;
  /**
   * Set to true if you want the tooltip to stay long enough so the user can move mouse over content to select text or click a link
   */
  interactive?: boolean;
}

/**
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/overlays-tooltip--docs
 */
export const Tooltip = forwardRef<HTMLElement, TooltipProps>(
  ({ children, theme, interactive, show, placement, content }, forwardedRef) => {
    const arrowRef = useRef(null);
    const [controlledVisible, setControlledVisible] = useState(show);
    const isOpen = show ?? controlledVisible;
    const floatingUIPlacement = getPlacement(placement);

    // the order of middleware is important!
    // `arrow` should almost always be at the end
    // see https://floating-ui.com/docs/arrow#order
    const middleware = [
      offset(8),
      ...getPositioningMiddleware(floatingUIPlacement),
      arrow({
        element: arrowRef,
      }),
    ];

    const { context, refs, floatingStyles } = useFloating({
      open: isOpen,
      placement: floatingUIPlacement,
      onOpenChange: setControlledVisible,
      middleware,
      whileElementsMounted: autoUpdate,
    });
    const tooltipId = useId();

    const hover = useHover(context, {
      handleClose: interactive ? safePolygon() : undefined,
      move: false,
    });
    const focus = useFocus(context);
    const dismiss = useDismiss(context);

    const { getReferenceProps, getFloatingProps } = useInteractions([dismiss, hover, focus]);

    const contentIsFunction = typeof content === 'function';

    const variant = theme === 'error' ? 'error' : 'info';

    const handleRef = useCallback(
      (ref: HTMLElement | null) => {
        refs.setReference(ref);

        if (typeof forwardedRef === 'function') {
          forwardedRef(ref);
        } else if (forwardedRef) {
          forwardedRef.current = ref;
        }
      },
      [forwardedRef, refs]
    );

    // if the child has a matching aria-label, this should take precedence over the tooltip content
    // otherwise we end up double announcing things in e.g. IconButton
    const childHasMatchingAriaLabel = 'aria-label' in children.props && children.props['aria-label'] === content;

    return (
      <>
        {cloneElement(children, {
          ref: handleRef,
          tabIndex: 0, // tooltip trigger should be keyboard focusable
          'aria-describedby': !childHasMatchingAriaLabel && isOpen ? tooltipId : undefined,
          ...getReferenceProps(),
        })}
        {isOpen && (
          <Portal>
            <div ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()}>
              <FloatingArrow
                className={stylex.props(arrowStyles[variant]).className}
                ref={arrowRef}
                context={context}
              />
              <div
                data-testid={selectors.components.Tooltip.container}
                id={tooltipId}
                role="tooltip"
                {...stylex.props(tooltipStyles.container, containerStyles[variant])}
              >
                {typeof content === 'string' && content}
                {isValidElement(content) && cloneElement(content)}
                {contentIsFunction && content({})}
              </div>
            </div>
          </Portal>
        )}
      </>
    );
  }
);

Tooltip.displayName = 'Tooltip';

const containerStyles = stylex.create({
  info: {
    backgroundColor: components['--gf-components-tooltip-background'],
    borderColor: components['--gf-components-tooltip-background'],
    color: components['--gf-components-tooltip-text'],
    paddingTop: spacing['--gf-spacing-x0-5'],
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x0-5'],
    paddingLeft: spacing['--gf-spacing-x1'],
  },
  error: {
    backgroundColor: colors['--gf-colors-error-main'],
    borderColor: colors['--gf-colors-error-main'],
    color: colors['--gf-colors-error-contrast-text'],
    paddingTop: spacing['--gf-spacing-x0-5'],
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x0-5'],
    paddingLeft: spacing['--gf-spacing-x1'],
  },
});

const arrowStyles = stylex.create({
  info: { fill: components['--gf-components-tooltip-background'] },
  error: { fill: colors['--gf-colors-error-main'] },
});
