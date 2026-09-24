import { useMemo, useRef } from 'react';
import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import { CSSTransition } from 'react-transition-group';

const slideStyles = stylex.create({
  enterWidth: { width: 0, opacity: 0 },
  enterHeight: { height: 0, opacity: 0 },
  enterActiveWidth: {
    width: 'var(--slide-size, 0px)',
    opacity: 1,
    '@media (prefers-reduced-motion: no-preference)': {
      transitionProperty: 'opacity, width',
      transitionDuration: 'var(--slide-transition-ms, 250ms)',
      transitionTimingFunction: 'ease-out',
    },
    '@media (prefers-reduced-motion: reduce)': {
      transitionProperty: 'opacity',
      transitionDuration: 'var(--slide-transition-ms, 250ms)',
      transitionTimingFunction: 'ease-out',
    },
  },
  enterActiveHeight: {
    height: 'var(--slide-size, 0px)',
    opacity: 1,
    '@media (prefers-reduced-motion: no-preference)': {
      transitionProperty: 'opacity, height',
      transitionDuration: 'var(--slide-transition-ms, 250ms)',
      transitionTimingFunction: 'ease-out',
    },
    '@media (prefers-reduced-motion: reduce)': {
      transitionProperty: 'opacity',
      transitionDuration: 'var(--slide-transition-ms, 250ms)',
      transitionTimingFunction: 'ease-out',
    },
  },
  exitWidth: { width: 'var(--slide-size, 0px)', opacity: 1 },
  exitHeight: { height: 'var(--slide-size, 0px)', opacity: 1 },
  exitActiveWidth: {
    width: 0,
    opacity: 0,
    '@media (prefers-reduced-motion: no-preference)': {
      transitionProperty: 'opacity, width',
      transitionDuration: 'var(--slide-transition-ms, 250ms)',
      transitionTimingFunction: 'ease-out',
    },
    '@media (prefers-reduced-motion: reduce)': {
      transitionProperty: 'opacity',
      transitionDuration: 'var(--slide-transition-ms, 250ms)',
      transitionTimingFunction: 'ease-out',
    },
  },
  exitActiveHeight: {
    height: 0,
    opacity: 0,
    '@media (prefers-reduced-motion: no-preference)': {
      transitionProperty: 'opacity, height',
      transitionDuration: 'var(--slide-transition-ms, 250ms)',
      transitionTimingFunction: 'ease-out',
    },
    '@media (prefers-reduced-motion: reduce)': {
      transitionProperty: 'opacity',
      transitionDuration: 'var(--slide-transition-ms, 250ms)',
      transitionTimingFunction: 'ease-out',
    },
  },
});

type Props = {
  children: React.ReactElement<Record<string, unknown>>;
  visible: boolean;
  size: number;
  duration?: number;
  horizontal?: boolean;
};

export function SlideOutTransition(props: Props) {
  const { visible, children, duration = 250, horizontal, size } = props;
  const transitionRef = useRef(null);

  const classNames = useMemo(() => {
    const h = horizontal;
    return {
      enter: stylex.props(h ? slideStyles.enterWidth : slideStyles.enterHeight).className ?? '',
      enterActive: stylex.props(h ? slideStyles.enterActiveWidth : slideStyles.enterActiveHeight).className ?? '',
      exit: stylex.props(h ? slideStyles.exitWidth : slideStyles.exitHeight).className ?? '',
      exitActive: stylex.props(h ? slideStyles.exitActiveWidth : slideStyles.exitActiveHeight).className ?? '',
    };
  }, [horizontal]);

  const child = React.cloneElement(children, {
    ref: transitionRef,
    style: {
      ...(children.props.style as object),
      ['--slide-transition-ms' as string]: `${duration}ms`,
      ['--slide-size' as string]: `${size}px`,
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
