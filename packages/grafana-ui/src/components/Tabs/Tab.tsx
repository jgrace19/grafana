import * as stylex from '@stylexjs/stylex';
import { type HTMLProps } from 'react';
import * as React from 'react';

import { type NavModelItem } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';

import { mergeStylexClassName } from '../../themes/stylex/mergeClassNames';
import { type IconName } from '../../types/icon';
import { Icon } from '../Icon/Icon';
import { Tooltip } from '../Tooltip/Tooltip';

import { Counter } from './Counter';
import { tabStyles, tabStyleProps } from './Tab.stylex';

export interface TabProps extends HTMLProps<HTMLElement> {
  label: string;
  active?: boolean;
  href?: string;
  icon?: IconName;
  onChangeTab?: (event: React.MouseEvent<HTMLElement>) => void;
  counter?: number | null;
  suffix?: NavModelItem['tabSuffix'];
  truncate?: boolean;
  tooltip?: string;
  disabled?: boolean;
  'data-testid'?: string;
}

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
    const linkProps = mergeStylexClassName(
      stylex.props(
        tabStyles.clearButton,
        tabStyles.link,
        active ? tabStyles.activeStyle : tabStyles.notActive,
        truncate && tabStyles.linkTruncate,
        disabled && tabStyles.disabled
      )
    );

    const commonProps = {
      ...linkProps,
      'data-testid': testId ?? selectors.components.Tab.title(label),
      ...otherProps,
      onClick: disabled ? undefined : onChangeTab,
      role: 'tab',
      'aria-selected': active,
      'aria-disabled': disabled,
      tabIndex: disabled ? -1 : undefined,
      title: !!tooltip ? undefined : otherProps.title,
    };

    const itemProps = mergeStylexClassName(
      stylex.props(tabStyles.item, truncate && tabStyles.itemTruncate),
      className
    );

    const content = (
      <>
        {icon && <Icon name={icon} data-testid={`tab-icon-${icon}`} />}
        {label}
        {typeof counter === 'number' && <Counter value={counter} />}
        {Suffix && <Suffix {...tabStyleProps('suffix')} />}
      </>
    );

    let tab = href ? (
      <div {...itemProps}>
        <a {...commonProps} href={disabled ? undefined : href} ref={ref as React.ForwardedRef<HTMLAnchorElement>}>
          {content}
        </a>
      </div>
    ) : (
      <div {...itemProps}>
        <button {...commonProps} type="button" ref={ref as React.ForwardedRef<HTMLButtonElement>}>
          {content}
        </button>
      </div>
    );

    return tooltip ? <Tooltip content={tooltip}>{tab}</Tooltip> : tab;
  }
);

Tab.displayName = 'Tab';
