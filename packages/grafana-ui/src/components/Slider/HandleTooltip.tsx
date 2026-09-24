import Tooltip, { type TooltipRef } from '@rc-component/tooltip';
import * as stylex from '@stylexjs/stylex';
import { useEffect, useRef } from 'react';
import * as React from 'react';

import { zIndex } from '../../themes/stylex/constants.stylex';
import { typography } from '../../themes/stylex/tokens.stylex';

const HandleTooltip = (props: {
  value: number;
  children: React.ReactElement;
  visible: boolean;
  placement: 'top' | 'right';
  tipFormatter?: () => React.ReactNode;
}) => {
  const { value, children, visible, placement, tipFormatter, ...restProps } = props;

  const tooltipRef = useRef<TooltipRef>(null);
  const rafRef = useRef<number | null>(null);

  function cancelKeepAlign() {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }
  }

  function keepAlign() {
    rafRef.current = requestAnimationFrame(() => {
      tooltipRef.current?.forceAlign();
    });
  }

  useEffect(() => {
    if (visible) {
      keepAlign();
    } else {
      cancelKeepAlign();
    }

    return cancelKeepAlign;
  }, [value, visible]);

  return (
    <Tooltip
      classNames={{
        container: stylex.props(styles.container).className,
        root: stylex.props(styles.tooltip).className,
      }}
      placement={placement}
      overlay={tipFormatter ?? value}
      ref={tooltipRef}
      visible={visible}
      {...restProps}
    >
      {children}
    </Tooltip>
  );
};

const styles = stylex.create({
  tooltip: {
    position: 'absolute',
    display: 'block',
    visibility: 'visible',
    fontSize: typography['--gf-typography-body-small-font-size'],
    opacity: 0.9,
    padding: 3,
    zIndex: zIndex.tooltip,
  },
  container: {
    minHeight: 'auto',
  },
});

export default HandleTooltip;
