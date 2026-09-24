import * as stylex from '@stylexjs/stylex';
import { clsx } from 'clsx';
import { uniqueId } from 'lodash';
import { type ReactNode, useRef, useState } from 'react';
import * as React from 'react';

import { motion } from '../../themes/stylex/constants.stylex';
import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { colors, spacing, typography } from '../../themes/stylex/tokens.stylex';
import { Icon } from '../Icon/Icon';
import { Spinner } from '../Spinner/Spinner';

import './CollapsableSection.global.css';

export interface Props {
  label: ReactNode;
  isOpen: boolean;
  /** Callback for the toggle functionality */
  onToggle?: (isOpen: boolean) => void;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  loading?: boolean;
  labelId?: string;
  headerDataTestId?: string;
  contentDataTestId?: string;
  unmountContentWhenClosed?: boolean;
}

/**
 * A simple container for enabling collapsing/expanding of content.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/layout-collapsablesection--docs
 */
export const CollapsableSection = ({
  label,
  isOpen,
  onToggle,
  className,
  contentClassName,
  children,
  labelId,
  loading = false,
  headerDataTestId,
  contentDataTestId,
  unmountContentWhenClosed = true,
}: Props) => {
  const [internalOpenState, toggleInternalOpenState] = useState<boolean>(isOpen);

  const isControlled = isOpen !== undefined && onToggle !== undefined;
  const isSectionOpen = isControlled ? isOpen : internalOpenState;

  const onClick = (e: React.MouseEvent) => {
    if (e.target instanceof HTMLElement && e.target.tagName === 'A') {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    onToggle?.(!isOpen);

    if (!isControlled) {
      toggleInternalOpenState(!internalOpenState);
    }
  };
  const { current: id } = useRef(uniqueId());

  const buttonLabelId = labelId ?? `collapse-label-${id}`;

  const content = (
    <div
      id={`collapse-content-${id}`}
      className={clsx(
        stylex.props(styles.content).className,
        contentClassName,
        !unmountContentWhenClosed && !isSectionOpen && stylex.props(styles.contentHidden).className
      )}
      data-testid={contentDataTestId}
    >
      {children}
    </div>
  );

  return (
    <>
      {/* disabling the a11y rules here as the button handles keyboard interactions */}
      {/* this is just to provide a better experience for mouse users */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div onClick={onClick} {...mergeStylexProps(stylex.props(styles.header), { className })}>
        <button
          type="button"
          id={`collapse-button-${id}`}
          className={clsx('gf-collapsable-section-button', stylex.props(styles.button).className)}
          onClick={onClick}
          aria-expanded={isSectionOpen && !loading}
          aria-controls={`collapse-content-${id}`}
          aria-labelledby={buttonLabelId}
        >
          {loading ? (
            <Spinner className={stylex.props(styles.spinner).className} />
          ) : (
            <Icon name={isSectionOpen ? 'angle-down' : 'angle-right'} xstyle={styles.icon} />
          )}
        </button>
        <div {...stylex.props(styles.label)} id={`collapse-label-${id}`} data-testid={headerDataTestId}>
          {label}
        </div>
      </div>
      {unmountContentWhenClosed ? isSectionOpen && content : content}
    </>
  );
};

const grid = spacing['--gf-spacing-grid-size'];
const focusRing = `0 0 0 2px ${colors['--gf-colors-background-canvas']}, 0 0 0px 4px ${colors['--gf-colors-primary-main']}`;

const styles = stylex.create({
  header: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    boxSizing: 'border-box',
    position: 'relative',
    justifyContent: 'flex-start',
    fontSize: typography['--gf-typography-size-lg'],
    paddingTop: `calc(${grid} * 0.5)`,
    paddingRight: 0,
    paddingBottom: `calc(${grid} * 0.5)`,
    paddingLeft: 0,
    outlineStyle: { default: null, ':focus-within': 'dotted' },
    outlineWidth: { default: null, ':focus-within': '2px' },
    outlineColor: { default: null, ':focus-within': 'transparent' },
    outlineOffset: { default: null, ':focus-within': '2px' },
    boxShadow: { default: null, ':focus-within': focusRing },
    transitionProperty: { default: null, ':focus-within': 'outline, outline-offset, box-shadow' },
    transitionDuration: { default: null, ':focus-within': { default: null, [motion.noPreferenceOrReduce]: '0.2s' } },
    transitionTimingFunction: {
      default: null,
      ':focus-within': { default: null, [motion.noPreferenceOrReduce]: 'cubic-bezier(0.19, 1, 0.22, 1)' },
    },
  },
  // The header shows the focus ring, so the button itself shows none.
  button: {
    marginRight: grid,
    outlineStyle: { default: null, ':focus-visible': 'none' },
    outlineOffset: { default: null, ':focus-visible': 'unset' },
    transitionProperty: { default: null, ':focus-visible': { default: null, [motion.noPreferenceOrReduce]: 'none' } },
    boxShadow: { default: null, ':focus-visible': 'none' },
  },
  icon: {
    color: colors['--gf-colors-text-secondary'],
  },
  content: {
    paddingTop: `calc(${grid} * 2)`,
    paddingRight: 0,
    paddingBottom: `calc(${grid} * 2)`,
    paddingLeft: 0,
  },
  contentHidden: {
    display: 'none',
  },
  spinner: {
    display: 'flex',
    alignItems: 'center',
    width: `calc(${grid} * 2)`,
  },
  label: {
    display: 'flex',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto',
    fontWeight: typography['--gf-typography-font-weight-medium'],
    color: colors['--gf-colors-text-max-contrast'],
  },
});
