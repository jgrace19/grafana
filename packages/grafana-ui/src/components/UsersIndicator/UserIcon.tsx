import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import { type PropsWithChildren } from 'react';

import { dateTime, type DateTimeInput } from '@grafana/data';
import { t, Trans } from '@grafana/i18n';

import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { colors, shape, spacing, typography } from '../../themes/stylex/tokens.stylex';
import { Tooltip } from '../Tooltip/Tooltip';

import { userIconMarker } from './markers.stylex';
import { type UserView } from './types';

export interface UserIconProps {
  /** An object that contains the user's details and an optional 'lastActiveAt' status */
  userView: UserView;
  /** A boolean value that determines whether the tooltip should be shown or not */
  showTooltip?: boolean;
  /** An optional class name to be added to the icon element */
  className?: string;
  /** onClick handler to be called when the icon is clicked */
  onClick?: () => void;
  /** @internal first-party StyleX overrides for the button */
  xstyle?: StyleXStyles;
}

/**
 * A helper function that takes in a dateString parameter
 * and returns the user's last viewed date in a specific format.
 */
const formatViewed = (dateString: DateTimeInput): string => {
  const date = dateTime(dateString);
  const diffHours = date.diff(dateTime(), 'hours', false);
  return `Active last ${(Math.floor(-diffHours / 24) + 1) * 24}h`;
};

/**
 * Output the initials of the first and last name (if given), capitalized and concatenated together.
 * If name is not provided, an empty string is returned.
 * @param {string} [name] The name to extract initials from.
 * @returns {string} The uppercase initials of the first and last name.
 * @example
 * // Returns 'JD'
 * getUserInitials('John Doe');
 * // Returns 'A'
 * getUserInitials('Alice');
 * // Returns ''
 * getUserInitials();
 */
const getUserInitials = (name?: string) => {
  if (!name) {
    return '';
  }
  const [first, last] = name.split(' ');
  return `${first?.[0] ?? ''}${last?.[0] ?? ''}`.toUpperCase();
};

/**
 * UserIcon renders a user icon and displays the user's name or initials along with the user's active status or last viewed date.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/iconography-usericon--docs
 */
export const UserIcon = ({
  userView,
  className,
  children,
  onClick,
  showTooltip = true,
  xstyle,
}: PropsWithChildren<UserIconProps>) => {
  const { user, lastActiveAt } = userView;
  const hasActive = lastActiveAt !== undefined && lastActiveAt !== null;
  const isActive = hasActive && dateTime(lastActiveAt).diff(dateTime(), 'minutes', true) >= -15;
  const variant = isActive ? 'active' : 'inactive';
  const shadow = showTooltip || onClick ? hoverShadowStyles[variant] : shadowStyles[variant];
  const content = (
    <button
      type={'button'}
      onClick={onClick}
      {...mergeStylexProps(stylex.props(styles.container, onClick && styles.pointer, userIconMarker, xstyle), {
        className,
      })}
      aria-label={t('grafana-ui.user-icon.label', '{{name}} icon', { name: user.name })}
    >
      {children ? (
        <div {...stylex.props(styles.content, styles.textContent, shadow)}>{children}</div>
      ) : user.avatarUrl ? (
        <img {...stylex.props(styles.content, shadow)} src={user.avatarUrl} alt={`${user.name} avatar`} />
      ) : (
        <div {...stylex.props(styles.content, styles.textContent, shadow)}>{getUserInitials(user.name)}</div>
      )}
    </button>
  );

  if (showTooltip) {
    const tooltip = (
      <div {...stylex.props(styles.tooltipContainer)}>
        <div {...stylex.props(styles.tooltipName)}>{user.name}</div>
        {hasActive && (
          <div {...stylex.props(styles.tooltipDate)}>
            {isActive ? (
              <div {...stylex.props(styles.dotContainer)}>
                <span>
                  <Trans i18nKey="grafana-ui.user-icon.active-text">Active last 15m</Trans>
                </span>
                <span {...stylex.props(styles.dot)}></span>
              </div>
            ) : (
              formatViewed(lastActiveAt)
            )}
          </div>
        )}
      </div>
    );

    return <Tooltip content={tooltip}>{content}</Tooltip>;
  } else {
    return content;
  }
};

const styles = stylex.create({
  container: {
    padding: 0,
    width: '30px',
    height: '30px',
    backgroundColor: 'transparent',
    borderStyle: 'none',
    borderRadius: shape['--gf-shape-radius-circle'],
    cursor: 'default',
  },
  content: {
    borderRadius: shape['--gf-shape-radius-circle'],
    lineHeight: '24px',
    maxWidth: '100%',
    borderWidth: '3px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-background-primary'],
    backgroundClip: 'padding-box',
  },
  textContent: {
    backgroundColor: colors['--gf-colors-background-primary'],
    padding: 0,
    color: colors['--gf-colors-text-secondary'],
    textAlign: 'center',
    fontSize: typography['--gf-typography-size-sm'],
  },
  tooltipContainer: {
    textAlign: 'center',
    paddingTop: 0,
    paddingRight: spacing['--gf-spacing-grid-size'],
    paddingBottom: 0,
    paddingLeft: spacing['--gf-spacing-grid-size'],
  },
  tooltipName: {
    fontWeight: typography['--gf-typography-font-weight-bold'],
  },
  tooltipDate: {
    fontWeight: typography['--gf-typography-font-weight-regular'],
  },
  dotContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  dot: {
    height: '6px',
    width: '6px',
    backgroundColor: colors['--gf-colors-primary-main'],
    borderRadius: shape['--gf-shape-radius-circle'],
    display: 'inline-block',
    marginLeft: spacing['--gf-spacing-grid-size'],
  },
  pointer: {
    cursor: 'pointer',
  },
});

const shadowStyles = stylex.create({
  active: { boxShadow: `0 0 0 1px ${colors['--gf-colors-primary-main']}` },
  inactive: { boxShadow: `0 0 0 1px ${colors['--gf-colors-border-medium']}` },
});

// A hoverable icon (tooltip or click handler) highlights its image or initials while the button is hovered.
const hoverShadowStyles = stylex.create({
  active: {
    boxShadow: {
      default: `0 0 0 1px ${colors['--gf-colors-primary-main']}`,
      [stylex.when.ancestor(':hover', userIconMarker)]: `0 0 0 1px ${colors['--gf-colors-primary-text']}`,
    },
  },
  inactive: {
    boxShadow: {
      default: `0 0 0 1px ${colors['--gf-colors-border-medium']}`,
      [stylex.when.ancestor(':hover', userIconMarker)]: `0 0 0 1px ${colors['--gf-colors-border-strong']}`,
    },
  },
});
