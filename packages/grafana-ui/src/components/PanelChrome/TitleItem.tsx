import * as stylex from '@stylexjs/stylex';
import { clsx } from 'clsx';
import { forwardRef } from 'react';
import * as React from 'react';

import { type LinkModel, type LinkTarget } from '@grafana/data';

import { motion } from '../../themes/stylex/constants.stylex';
import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { colors, components, shadows, shape, spacing } from '../../themes/stylex/tokens.stylex';
import { Button } from '../Button/Button';

import './TitleItem.css';

type TitleItemProps = {
  className?: string;
  children: React.ReactNode;
  onClick?: LinkModel['onClick'];
  href?: string;
  target?: LinkTarget;
  title?: string;
};

type TitleItemElement = HTMLAnchorElement & HTMLButtonElement;

export const TitleItem = forwardRef<TitleItemElement, TitleItemProps>(
  ({ className, children, href, onClick, target, title, ...rest }, ref) => {
    if (href) {
      return (
        <a
          ref={ref}
          href={href}
          onClick={onClick}
          target={target}
          title={title}
          {...mergeStylexProps(stylex.props(styles.item, styles.pointer), { className })}
          {...rest}
        >
          {children}
        </a>
      );
    } else if (onClick) {
      return (
        <Button
          ref={ref}
          className={clsx('gf-panel-header-item', className)}
          variant="secondary"
          fill="text"
          onClick={onClick}
        >
          {children}
        </Button>
      );
    } else {
      return (
        <span ref={ref} {...mergeStylexProps(stylex.props(styles.item), { className })} {...rest}>
          {children}
        </span>
      );
    }
  }
);

TitleItem.displayName = 'TitleItem';

const focusRing = `0 0 0 2px ${colors['--gf-colors-background-canvas']}, 0 0 0px 4px ${colors['--gf-colors-primary-main']}`;

// Any focus shows the ring. The Emotion mouse-focus reset (`'&: focus:not(:focus-visible)'`) was an invalid
// selector and never applied. `:hover` came after `:focus` in the Emotion rule, so it wins while both match.
const styles = stylex.create({
  item: {
    color: { default: colors['--gf-colors-text-secondary'], ':hover': colors['--gf-colors-text-primary'] },
    borderStyle: 'none',
    borderRadius: shape['--gf-shape-radius-default'],
    paddingTop: 0,
    paddingRight: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
    paddingBottom: 0,
    paddingLeft: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
    height: `calc(${spacing['--gf-spacing-grid-size']} * ${components['--gf-components-height-md']})`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: { default: null, ':hover': colors['--gf-colors-secondary-shade'] },
    boxShadow: {
      default: null,
      ':hover': shadows['--gf-shadows-z1'],
      ':focus': { default: focusRing, ':hover': shadows['--gf-shadows-z1'] },
    },
    outlineStyle: { default: null, ':focus': 'dotted' },
    outlineWidth: { default: null, ':focus': '2px' },
    outlineColor: { default: null, ':focus': 'transparent' },
    outlineOffset: { default: null, ':focus': '2px' },
    transitionProperty: { default: null, ':focus': 'outline, outline-offset, box-shadow' },
    transitionDuration: { default: null, ':focus': { default: null, [motion.noPreferenceOrReduce]: '0.2s' } },
    transitionTimingFunction: {
      default: null,
      ':focus': { default: null, [motion.noPreferenceOrReduce]: 'cubic-bezier(0.19, 1, 0.22, 1)' },
    },
    zIndex: { default: null, ':focus': 1 },
  },
  pointer: {
    cursor: 'pointer',
  },
});
