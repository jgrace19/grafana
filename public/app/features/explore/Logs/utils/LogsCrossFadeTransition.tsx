import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { logsCrossFadeTransitionStyles } from './LogsCrossFadeTransition.stylex';
import { useRef } from 'react';
import * as React from 'react';
import { CSSTransition } from 'react-transition-group';


const transitionDuration = 500;
// We add a bit of delay to the transition as another perf optimisation. As at the start we need to render
// quite a bit of new rows, if we start transition at the same time there can be frame rate drop. This gives time
// for react to first render them and then do the animation.
const transitionDelay = 100;

;

type Props = {
  children: React.ReactElement;
  visible: boolean;
};

/**
 * Cross fade transition component that is tied a bit too much to the logs containers so not very useful elsewhere
 * right now.
 */
export function LogsCrossFadeTransition(props: Props) {
  const { visible, children } = props;
  const transitionRef = useRef(null);
  return (
    <CSSTransition
      in={visible}
      mountOnEnter={true}
      unmountOnExit={true}
      timeout={transitionDuration + transitionDelay}
      classNames={{
        enter: mergeStylexClassName(stylex.props(logsCrossFadeTransitionStyles.logsEnter), undefined).className,
        enterActive: mergeStylexClassName(stylex.props(logsCrossFadeTransitionStyles.logsEnterActive), undefined).className,
        exit: mergeStylexClassName(stylex.props(logsCrossFadeTransitionStyles.logsExit), undefined).className,
        exitActive: mergeStylexClassName(stylex.props(logsCrossFadeTransitionStyles.logsExitActive), undefined).className,
      }}
      nodeRef={transitionRef}
    >
      <div ref={transitionRef}>{children}</div>
    </CSSTransition>
  );
}
