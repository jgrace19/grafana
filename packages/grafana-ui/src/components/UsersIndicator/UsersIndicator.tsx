import * as stylex from '@stylexjs/stylex';

import { t } from '@grafana/i18n';

import { spacing } from '../../themes/stylex/tokens.stylex';

import { UserIcon } from './UserIcon';
import { type UserView } from './types';

export interface UsersIndicatorProps {
  /** An object that contains the user's details and an optional 'lastActiveAt' status */
  users: UserView[];
  /** A limit of how many user icons to show before collapsing them and showing a number of users instead */
  limit?: number;
  /** onClick handler for the user number indicator */
  onClick?: () => void;
}

/**
 * A component that displays a set of user icons indicating which users are currently active. If there are too many users to display all the icons, it will collapse the icons into a single icon with a number indicating the number of additional users.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/iconography-usersindicator--docs
 */
export const UsersIndicator = ({ users, onClick, limit = 4 }: UsersIndicatorProps) => {
  if (!users.length) {
    return null;
  }
  // The icon stacking follows the limit as passed, before the fallback below.
  const stackLimit = limit;
  // Make sure limit is never negative
  limit = limit > 0 ? limit : 4;
  const limitReached = users.length > limit;
  const extraUsers = users.length - limit;
  // Prevent breaking the layout when there's more than 99 users
  const tooManyUsers = extraUsers > 99;

  return (
    <div
      {...stylex.props(styles.container)}
      aria-label={t('grafana-ui.users-indicator.container-label', 'Users indicator container')}
    >
      {users.slice(0, limitReached ? limit : limit + 1).map((userView, idx, arr) => (
        <UserIcon
          key={userView.user.name}
          userView={userView}
          xstyle={[styles.stacked, idx < stackLimit && styles.zIndex(stackLimit - idx)]}
        />
      ))}
      {limitReached && (
        <UserIcon
          onClick={onClick}
          userView={{ user: { name: 'Extra users' } }}
          showTooltip={false}
          xstyle={styles.stacked}
        >
          {tooManyUsers
            ? // eslint-disable-next-line @grafana/i18n/no-untranslated-strings
              '...'
            : `+${extraUsers}`}
        </UserIcon>
      )}
    </div>
  );
};

const styles = stylex.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    marginLeft: spacing['--gf-spacing-grid-size'],
    isolation: 'isolate',
  },
  // Overlay the icons a bit on top of each other
  stacked: {
    marginLeft: `calc(${spacing['--gf-spacing-grid-size']} * -1)`,
  },
  // Stacks overlaying icons in order: earlier icons on top
  zIndex: (zIndex: number) => ({ zIndex }),
});
