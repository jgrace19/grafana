import * as stylex from '@stylexjs/stylex';
import { useRef } from 'react';
import * as React from 'react';
import { CSSTransition } from 'react-transition-group';

import { motion } from '../../themes/stylex/constants.stylex';

type Props = {
  children: React.ReactElement<Record<string, unknown>>;
  visible: boolean;
  duration?: number;
};

export function FadeTransition(props: Props) {
  const { visible, children, duration = 250 } = props;
  const transitionRef = useRef<HTMLElement>(null);
  const setDuration = () => transitionRef.current?.style.setProperty('--gf-transition-duration', `${duration}ms`);

  return (
    <CSSTransition
      in={visible}
      mountOnEnter={true}
      unmountOnExit={true}
      timeout={duration}
      classNames={classNames}
      nodeRef={transitionRef}
      onEnter={setDuration}
      onExit={setDuration}
    >
      {React.cloneElement(children, { ref: transitionRef })}
    </CSSTransition>
  );
}

const styles = stylex.create({
  enter: {
    opacity: 0,
  },
  enterActive: {
    opacity: 1,
    transitionProperty: { default: null, [motion.noPreferenceOrReduce]: 'opacity' },
    transitionDuration: { default: null, [motion.noPreferenceOrReduce]: 'var(--gf-transition-duration)' },
    transitionTimingFunction: { default: null, [motion.noPreferenceOrReduce]: 'ease-out' },
  },
  exit: {
    opacity: 1,
  },
  exitActive: {
    opacity: 0,
    transitionProperty: { default: null, [motion.noPreferenceOrReduce]: 'opacity' },
    transitionDuration: { default: null, [motion.noPreferenceOrReduce]: 'var(--gf-transition-duration)' },
    transitionTimingFunction: { default: null, [motion.noPreferenceOrReduce]: 'ease-out' },
  },
});

const classNames = {
  enter: stylex.props(styles.enter).className,
  enterActive: stylex.props(styles.enterActive).className,
  exit: stylex.props(styles.exit).className,
  exitActive: stylex.props(styles.exitActive).className,
};
