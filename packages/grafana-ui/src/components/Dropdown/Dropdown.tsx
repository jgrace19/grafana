import {
  FloatingFocusManager,
  autoUpdate,
  offset as floatingUIOffset,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
} from '@floating-ui/react';
import { useCallback, useRef, useState } from 'react';
import * as React from 'react';
import { CSSTransition } from 'react-transition-group';

import { getPositioningMiddleware } from '../../utils/floating';
import { renderOrCallToRender } from '../../utils/reactUtils';
import { getPlacement } from '../../utils/tooltipUtils';
import { Portal } from '../Portal/Portal';
import { type TooltipPlacement } from '../Tooltip/types';

import './Dropdown.global.css';

export interface Props {
  overlay: React.ReactElement | (() => React.ReactElement);
  placement?: TooltipPlacement;
  children: React.ReactElement<Record<string, unknown>>;
  root?: HTMLElement;
  /** Amount in pixels to nudge the dropdown vertically and horizontally, respectively. */
  offset?: [number, number];
  onVisibleChange?: (state: boolean) => void;
}

/**
 * Hook up a menu or other overlay to any trigger.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/overlays-dropdown--docs
 */
export const Dropdown = React.memo(({ children, overlay, placement, offset, root, onVisibleChange }: Props) => {
  const [show, setShow] = useState(false);
  const transitionRef = useRef(null);
  const floatingUIPlacement = getPlacement(placement);

  const handleOpenChange = useCallback(
    (newState: boolean) => {
      setShow(newState);
      onVisibleChange?.(newState);
    },
    [onVisibleChange]
  );

  // the order of middleware is important!
  const middleware = [
    floatingUIOffset({
      mainAxis: offset?.[0] ?? 8,
      crossAxis: offset?.[1] ?? 0,
    }),
    ...getPositioningMiddleware(floatingUIPlacement),
  ];

  const { context, refs, floatingStyles } = useFloating({
    open: show,
    placement: floatingUIPlacement,
    onOpenChange: handleOpenChange,
    middleware,
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([dismiss, click]);

  // Keep in sync with the transition duration in Dropdown.global.css.
  const animationDuration = 150;

  const onOverlayClicked = () => {
    handleOpenChange(false);
  };

  const handleKeys = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      handleOpenChange(false);
    }
  };

  return (
    <>
      {React.cloneElement(children, {
        ref: refs.setReference,
        ...getReferenceProps(),
        'aria-expanded': show,
      })}
      {show && (
        <Portal root={root}>
          <FloatingFocusManager context={context}>
            {/*
              this is handling bubbled events from the inner overlay
              see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/no-static-element-interactions.md#case-the-event-handler-is-only-being-used-to-capture-bubbled-events
            */}
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              onClick={onOverlayClicked}
              onKeyDown={handleKeys}
              {...getFloatingProps()}
            >
              <CSSTransition
                nodeRef={transitionRef}
                appear={true}
                in={true}
                timeout={{ appear: animationDuration, exit: 0, enter: 0 }}
                classNames={animationClassNames}
              >
                <div ref={transitionRef}>{renderOrCallToRender(overlay, {})}</div>
              </CSSTransition>
            </div>
          </FloatingFocusManager>
        </Portal>
      )}
    </>
  );
});

Dropdown.displayName = 'Dropdown';

const animationClassNames = {
  appear: 'gf-dropdown-appear',
  appearActive: 'gf-dropdown-appear-active',
};
