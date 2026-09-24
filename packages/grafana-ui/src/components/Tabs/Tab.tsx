import * as stylex from '@stylexjs/stylex';
import { clsx } from 'clsx';
import { type HTMLProps } from 'react';
import * as React from 'react';

import { type NavModelItem } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';

import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { mixins } from '../../themes/stylex/mixins';
import { colors, shape, spacing } from '../../themes/stylex/tokens.stylex';
import { type IconName } from '../../types/icon';
import { Icon } from '../Icon/Icon';
import { Tooltip } from '../Tooltip/Tooltip';

import { Counter } from './Counter';
import './Tabs.css';

export interface TabProps extends HTMLProps<HTMLElement> {
  label: string;
  active?: boolean;
  /** When provided, it is possible to use the tab as a hyperlink. Use in cases where the tabs update location. */
  href?: string;
  icon?: IconName;
  onChangeTab?: (event: React.MouseEvent<HTMLElement>) => void;
  /** A number rendered next to the text. Usually used to display the number of items in a tab's view. */
  counter?: number | null;
  /** Extra content, displayed after the tab label and counter */
  suffix?: NavModelItem['tabSuffix'];
  truncate?: boolean;
  tooltip?: string;
  /** When true, the tab will be disabled and not clickable */
  disabled?: boolean;
  /** When provided, used instead of label for the data-testid. Useful for locale-stable e2e selectors. */
  'data-testid'?: string;
}

/**
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/navigation-tabs--docs
 */
export const Tab = React.forwardRef<HTMLElement, TabProps>(
  (
    {
      label,
      active,
      icon,
      onChangeTab,
      counter,
      suffix: Suffix,
      className,
      href,
      truncate,
      tooltip,
      disabled,
      'data-testid': testId,
      ...otherProps
    },
    ref
  ) => {
    const content = () => (
      <>
        {icon && <Icon name={icon} data-testid={`tab-icon-${icon}`} />}
        {label}
        {typeof counter === 'number' && <Counter value={counter} />}
        {Suffix && <Suffix className={stylex.props(styles.suffix).className} />}
      </>
    );

    const link = stylex.props(
      mixins.focusRing,
      styles.link,
      active ? styles.activeStyle : styles.notActive,
      truncate && styles.linkTruncate,
      // eslint-disable-next-line @grafana/stylex-no-toggled-pseudo-state -- aria-disabled link, a toggled class on main too
      disabled && styles.disabled
    );

    const commonProps = {
      className: clsx('gf-tab-link', link.className),
      'data-testid': testId ?? selectors.components.Tab.title(label),
      ...otherProps,
      onClick: disabled ? undefined : onChangeTab,
      role: 'tab',
      'aria-selected': active,
      'aria-disabled': disabled,
      tabIndex: disabled ? -1 : undefined,
      title: !!tooltip ? undefined : otherProps.title, // If tooltip is provided, don't set the title on the link or button, it looks weird
    };

    let tab = null;

    if (href) {
      tab = (
        <div {...mergeStylexProps(stylex.props(styles.item, truncate && styles.itemTruncate), { className })}>
          <a
            {...commonProps}
            href={disabled ? undefined : href}
            // don't think we can avoid the type assertion here :(
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
            ref={ref as React.ForwardedRef<HTMLAnchorElement>}
          >
            {content()}
          </a>
        </div>
      );
    } else {
      tab = (
        <div {...mergeStylexProps(stylex.props(styles.item, truncate && styles.itemTruncate), { className })}>
          <button
            {...commonProps}
            type="button"
            // don't think we can avoid the type assertion here :(
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
            ref={ref as React.ForwardedRef<HTMLButtonElement>}
          >
            {content()}
          </button>
        </div>
      );
    }

    if (tooltip) {
      return <Tooltip content={tooltip}>{tab}</Tooltip>;
    }

    return tab;
  }
);

Tab.displayName = 'Tab';

const styles = stylex.create({
  item: {
    listStyle: 'none',
    position: 'relative',
    display: 'flex',
    whiteSpace: 'nowrap',
    paddingTop: 0,
    paddingRight: `calc(${spacing['--gf-spacing-grid-size']} * 0.5)`,
    paddingBottom: 0,
    paddingLeft: `calc(${spacing['--gf-spacing-grid-size']} * 0.5)`,
  },
  itemTruncate: {
    maxWidth: `calc(${spacing['--gf-spacing-grid-size']} * 40)`,
  },
  // Also resets the native button (the old clearButtonStyles).
  link: {
    backgroundColor: 'transparent',
    borderStyle: 'none',
    color: colors['--gf-colors-text-secondary'],
    paddingTop: spacing['--gf-spacing-grid-size'],
    paddingRight: `calc(${spacing['--gf-spacing-grid-size']} * 1.5)`,
    paddingBottom: spacing['--gf-spacing-grid-size'],
    paddingLeft: `calc(${spacing['--gf-spacing-grid-size']} * 1.5)`,
    borderRadius: shape['--gf-shape-radius-default'],
    display: 'block',
    height: '100%',
    '::before': {
      display: 'block',
      content: '" "',
      position: 'absolute',
      left: 0,
      right: 0,
      height: '2px',
      borderRadius: shape['--gf-shape-radius-default'],
      bottom: 0,
    },
  },
  linkTruncate: {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    wordBreak: 'break-word',
    overflow: 'hidden',
  },
  notActive: {
    color: {
      default: colors['--gf-colors-text-secondary'],
      ':hover': colors['--gf-colors-text-primary'],
      ':focus': colors['--gf-colors-text-primary'],
    },
    '::before': {
      backgroundColor: {
        default: null,
        ':hover': colors['--gf-colors-action-hover'],
        ':focus': colors['--gf-colors-action-hover'],
      },
    },
  },
  activeStyle: {
    color: colors['--gf-colors-text-primary'],
    overflow: 'hidden',
    '::before': {
      backgroundImage: colors['--gf-colors-gradients-brand-horizontal'],
    },
  },
  suffix: {
    marginLeft: spacing['--gf-spacing-grid-size'],
  },
  // Applied last, so it replaces the hover/focus colours as well.
  disabled: {
    color: colors['--gf-colors-text-disabled'],
    cursor: 'not-allowed',
    '::before': {
      backgroundColor: 'transparent',
    },
  },
});
