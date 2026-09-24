import * as stylex from '@stylexjs/stylex';
import { clsx } from 'clsx';
import { forwardRef } from 'react';

import { selectors } from '@grafana/e2e-selectors';

import { colors, shape, spacing } from '../../themes/stylex/tokens.stylex';
import { Icon } from '../Icon/Icon';

import { Counter } from './Counter';
import { type TabProps } from './Tab';
import './Tabs.css';

export const VerticalTab = forwardRef<HTMLAnchorElement, TabProps>(
  ({ label, active, icon, counter, className, suffix: Suffix, onChangeTab, href, ...otherProps }, ref) => {
    const content = () => (
      <>
        {icon && <Icon name={icon} />}
        {label}
        {typeof counter === 'number' && <Counter value={counter} />}
        {Suffix && <Suffix className={stylex.props(styles.suffix).className} />}
      </>
    );

    const linkClass = clsx('gf-vertical-tab', stylex.props(styles.link, active && styles.activeStyle).className);

    return (
      <a
        href={href}
        className={linkClass}
        {...otherProps}
        onClick={onChangeTab}
        aria-label={otherProps['aria-label'] || selectors.components.Tab.title(label)}
        role="tab"
        aria-selected={active}
        ref={ref}
      >
        {content()}
      </a>
    );
  }
);

VerticalTab.displayName = 'Tab';

const styles = stylex.create({
  link: {
    paddingTop: '6px',
    paddingRight: '12px',
    paddingBottom: '6px',
    paddingLeft: '12px',
    display: 'block',
    height: '100%',
    cursor: 'pointer',
    position: 'relative',
    color: colors['--gf-colors-text-primary'],
    textDecoration: { default: null, ':hover': 'underline', ':focus': 'underline' },
  },
  activeStyle: {
    color: colors['--gf-colors-text-max-contrast'],
    overflow: 'hidden',
    '::before': {
      display: 'block',
      content: '" "',
      position: 'absolute',
      left: 0,
      width: '4px',
      bottom: '2px',
      top: '2px',
      borderRadius: shape['--gf-shape-radius-default'],
      backgroundImage: 'linear-gradient(0deg, #f05a28 30%, #fbca0a 99%)',
    },
  },
  suffix: {
    marginLeft: spacing['--gf-spacing-grid-size'],
  },
});
