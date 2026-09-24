import * as stylex from '@stylexjs/stylex';
import { useRef } from 'react';
import * as React from 'react';
import { CSSTransition } from 'react-transition-group';

import { motion } from '../../themes/stylex/constants.stylex';

type Props = {
  children: React.ReactElement<Record<string, unknown>>;
  visible: boolean;
  size: number;

  duration?: number;
  horizontal?: boolean;
};

export function SlideOutTransition(props: Props) {
  const { visible, children, duration = 250, horizontal, size } = props;
  const transitionRef = useRef<HTMLElement>(null);
  const setVars = () => {
    transitionRef.current?.style.setProperty('--gf-transition-duration', `${duration}ms`);
    transitionRef.current?.style.setProperty('--gf-transition-size', `${size}px`);
  };

  return (
    <CSSTransition
      in={visible}
      mountOnEnter={true}
      unmountOnExit={true}
      timeout={duration}
      classNames={horizontal ? horizontalClassNames : verticalClassNames}
      nodeRef={transitionRef}
      onEnter={setVars}
      onExit={setVars}
    >
      {React.cloneElement(children, { ref: transitionRef })}
    </CSSTransition>
  );
}

const durationVar = 'var(--gf-transition-duration)';
const sizeVar = 'var(--gf-transition-size)';

const horizontalStyles = stylex.create({
  enter: {
    width: 0,
    opacity: 0,
  },
  enterActive: {
    width: sizeVar,
    opacity: 1,
    transitionProperty: { default: null, [motion.noPreference]: 'opacity, width', [motion.reduce]: 'opacity' },
    transitionDuration: { default: null, [motion.noPreference]: durationVar, [motion.reduce]: durationVar },
    transitionTimingFunction: { default: null, [motion.noPreference]: 'ease-out', [motion.reduce]: 'ease-out' },
  },
  exit: {
    width: sizeVar,
    opacity: 1,
  },
  exitActive: {
    opacity: 0,
    width: 0,
    transitionProperty: { default: null, [motion.noPreference]: 'opacity, width', [motion.reduce]: 'opacity' },
    transitionDuration: { default: null, [motion.noPreference]: durationVar, [motion.reduce]: durationVar },
    transitionTimingFunction: { default: null, [motion.noPreference]: 'ease-out', [motion.reduce]: 'ease-out' },
  },
});

const verticalStyles = stylex.create({
  enter: {
    height: 0,
    opacity: 0,
  },
  enterActive: {
    height: sizeVar,
    opacity: 1,
    transitionProperty: { default: null, [motion.noPreference]: 'opacity, height', [motion.reduce]: 'opacity' },
    transitionDuration: { default: null, [motion.noPreference]: durationVar, [motion.reduce]: durationVar },
    transitionTimingFunction: { default: null, [motion.noPreference]: 'ease-out', [motion.reduce]: 'ease-out' },
  },
  exit: {
    height: sizeVar,
    opacity: 1,
  },
  exitActive: {
    opacity: 0,
    height: 0,
    transitionProperty: { default: null, [motion.noPreference]: 'opacity, height', [motion.reduce]: 'opacity' },
    transitionDuration: { default: null, [motion.noPreference]: durationVar, [motion.reduce]: durationVar },
    transitionTimingFunction: { default: null, [motion.noPreference]: 'ease-out', [motion.reduce]: 'ease-out' },
  },
});

const horizontalClassNames = {
  enter: stylex.props(horizontalStyles.enter).className,
  enterActive: stylex.props(horizontalStyles.enterActive).className,
  exit: stylex.props(horizontalStyles.exit).className,
  exitActive: stylex.props(horizontalStyles.exitActive).className,
};

const verticalClassNames = {
  enter: stylex.props(verticalStyles.enter).className,
  enterActive: stylex.props(verticalStyles.enterActive).className,
  exit: stylex.props(verticalStyles.exit).className,
  exitActive: stylex.props(verticalStyles.exitActive).className,
};
