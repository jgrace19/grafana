import {
  arrow,
  autoUpdate,
  FloatingArrow,
  FloatingFocusManager,
  offset,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
} from '@floating-ui/react';
import { type Placement } from '@popperjs/core';
import * as stylex from '@stylexjs/stylex';
import { memo, cloneElement, isValidElement, useRef, useState, type JSX } from 'react';

import { t } from '@grafana/i18n';

import { useTheme2 } from '../../themes/ThemeContext';
import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { colors, components, spacing } from '../../themes/stylex/tokens.stylex';
import { getPositioningMiddleware } from '../../utils/floating';
import { getPlacement, tooltipStyles } from '../../utils/tooltipUtils';
import { IconButton } from '../IconButton/IconButton';
import { getPortalContainer, Portal } from '../Portal/Portal';

import { type ToggletipContent } from './types';

export interface ToggletipProps {
  /** The theme used to display the toggletip */
  theme?: 'info' | 'error';
  /** The title to be displayed on the header */
  title?: JSX.Element | string;
  /** determine whether to show or not the close button **/
  closeButton?: boolean;
  /** Callback function to be called when the toggletip is closed */
  onClose?: () => void;
  /** The preferred placement of the toggletip */
  placement?: Placement;
  /** The text or component that houses the content of the toggleltip */
  content: ToggletipContent;
  /** The text or component to be displayed on the toggletip's bottom */
  footer?: JSX.Element | string;
  /** The UI control users interact with to display toggletips */
  children: JSX.Element;
  /** Determine whether the toggletip should fit its content or not */
  fitContent?: boolean;
  /** Determine whether the toggletip should be shown or not */
  show?: boolean;
  /** Callback function to be called when the toggletip is opened */
  onOpen?: () => void;
  /** Dismiss the toggletip when an ancestor element is scrolled */
  dismissOnScroll?: boolean;
}

/**
 * Toggletips, similar to Tooltips, provide contextual support for users when needed. They are hidden by default, a UI trigger or text link are clicked to set them to their visible state. Toggletips, unlike tooltips, are persistent until a user takes action to dismiss them by clicking on the required “X” (close) trigger. Toggletips are capable of containing varying types of complex content including interactive components, buttons, and dropdowns.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/overlays-toggletip--docs
 */
export const Toggletip = memo(
  ({
    children,
    theme = 'info',
    placement = 'auto',
    content,
    title,
    closeButton = true,
    onClose,
    footer,
    fitContent = false,
    onOpen,
    show,
    dismissOnScroll = false,
  }: ToggletipProps) => {
    const arrowRef = useRef(null);
    const grafanaTheme = useTheme2();
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
      onOpenChange: (open) => {
        if (show === undefined) {
          setControlledVisible(open);
        }
        if (!open) {
          onClose?.();
        } else {
          onOpen?.();
        }
      },
      middleware,
      whileElementsMounted: autoUpdate,
      strategy: 'fixed',
    });

    const click = useClick(context);
    const dismiss = useDismiss(context, { ancestorScroll: dismissOnScroll });

    const { getReferenceProps, getFloatingProps } = useInteractions([dismiss, click]);

    return (
      <>
        {cloneElement(children, {
          ref: refs.setReference,
          tabIndex: 0,
          'aria-expanded': isOpen,
          ...getReferenceProps(),
        })}
        {isOpen && (
          <Portal>
            <FloatingFocusManager context={context} modal={true} getInsideElements={() => [getPortalContainer()]}>
              <div
                data-testid="toggletip-content"
                {...mergeStylexProps(
                  stylex.props(tooltipStyles.container, containerStyles[theme], fitContent && styles.fitContent),
                  { style: floatingStyles }
                )}
                ref={refs.setFloating}
                {...getFloatingProps()}
              >
                <FloatingArrow
                  strokeWidth={0.3}
                  stroke={grafanaTheme.colors.border.weak}
                  className={stylex.props(arrowStyles[theme]).className}
                  ref={arrowRef}
                  context={context}
                />
                {Boolean(title) && <div {...stylex.props(tooltipStyles.header)}>{title}</div>}
                {closeButton && (
                  <div {...stylex.props(tooltipStyles.headerClose)}>
                    <IconButton
                      aria-label={t('grafana-ui.toggletip.close', 'Close')}
                      name="times"
                      data-testid="toggletip-header-close"
                      onClick={() => {
                        setControlledVisible(false);
                        onClose?.();
                      }}
                    />
                  </div>
                )}
                <div {...stylex.props(tooltipStyles.body)}>
                  {(typeof content === 'string' || isValidElement(content)) && content}
                  {typeof content === 'function' && content({})}
                </div>
                {Boolean(footer) && <div {...stylex.props(tooltipStyles.footer)}>{footer}</div>}
              </div>
            </FloatingFocusManager>
          </Portal>
        )}
      </>
    );
  }
);

Toggletip.displayName = 'Toggletip';

const containerStyles = stylex.create({
  info: {
    backgroundColor: colors['--gf-colors-background-primary'],
    borderColor: colors['--gf-colors-border-weak'],
    color: components['--gf-components-tooltip-text'],
    paddingTop: spacing['--gf-spacing-x2'],
    paddingRight: spacing['--gf-spacing-x2'],
    paddingBottom: spacing['--gf-spacing-x2'],
    paddingLeft: spacing['--gf-spacing-x2'],
  },
  error: {
    backgroundColor: colors['--gf-colors-error-main'],
    borderColor: colors['--gf-colors-error-main'],
    color: colors['--gf-colors-error-contrast-text'],
    paddingTop: spacing['--gf-spacing-x2'],
    paddingRight: spacing['--gf-spacing-x2'],
    paddingBottom: spacing['--gf-spacing-x2'],
    paddingLeft: spacing['--gf-spacing-x2'],
  },
});

const arrowStyles = stylex.create({
  info: { fill: colors['--gf-colors-background-primary'] },
  error: { fill: colors['--gf-colors-error-main'] },
});

const styles = stylex.create({
  fitContent: {
    maxWidth: 'fit-content',
  },
});
