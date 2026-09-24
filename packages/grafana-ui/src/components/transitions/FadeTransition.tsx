import { useMemo, useRef } from 'react';
import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import { CSSTransition } from 'react-transition-group';

const fadeStyles = stylex.create({
  enter: { opacity: 0 },
  enterActive: {
    opacity: 1,
    '@media (prefers-reduced-motion: no-preference)': {
      transitionProperty: 'opacity',
      transitionDuration: 'var(--fade-transition-ms, 250ms)',
      transitionTimingFunction: 'ease-out',
    },
  },
  exit: { opacity: 1 },
  exitActive: {
    opacity: 0,
    '@media (prefers-reduced-motion: no-preference)': {
      transitionProperty: 'opacity',
      transitionDuration: 'var(--fade-transition-ms, 250ms)',
      transitionTimingFunction: 'ease-out',
    },
  },
});

type Props = {
  children: React.ReactElement<Record<string, unknown>>;
  visible: boolean;
  duration?: number;
};

export function FadeTransition(props: Props) {
  const { visible, children, duration = 250 } = props;
  const transitionRef = useRef(null);
  const classNames = useMemo(
    () => ({
      enter: stylex.props(fadeStyles.enter).className ?? '',
      enterActive: stylex.props(fadeStyles.enterActive).className ?? '',
      exit: stylex.props(fadeStyles.exit).className ?? '',
      exitActive: stylex.props(fadeStyles.exitActive).className ?? '',
    }),
    []
  );

  const child = React.cloneElement(children, {
    ref: transitionRef,
    style: {
      ...(children.props.style as object),
      ['--fade-transition-ms' as string]: `${duration}ms`,
    },
  });

  return (
    <CSSTransition
      in={visible}
      mountOnEnter
      unmountOnExit
      timeout={duration}
      classNames={classNames}
      nodeRef={transitionRef}
    >
      {child}
    </CSSTransition>
  );
}
