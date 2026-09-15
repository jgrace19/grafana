import { css } from '@emotion/css';

import { GrafanaTheme2 } from '@grafana/data';
import { Icon, Tooltip, useStyles2 } from '@grafana/ui';

interface CommentBadgeProps {
  count: number;
  unresolvedCount?: number;
  onClick?: () => void;
}

export function CommentBadge({ count, unresolvedCount = 0, onClick }: CommentBadgeProps) {
  const styles = useStyles2(getStyles);

  if (count === 0) {
    return null;
  }

  const hasUnresolved = unresolvedCount > 0;
  const tooltipContent = hasUnresolved
    ? `${count} comment${count !== 1 ? 's' : ''} (${unresolvedCount} unresolved)`
    : `${count} comment${count !== 1 ? 's' : ''}`;

  return (
    <Tooltip content={tooltipContent}>
      <button
        className={styles.badge}
        onClick={onClick}
        aria-label={tooltipContent}
        data-has-unresolved={hasUnresolved}
      >
        <Icon name="comment-alt" size="sm" />
        <span className={styles.count}>{count}</span>
        {hasUnresolved && <span className={styles.dot} />}
      </button>
    </Tooltip>
  );
}

const getStyles = (theme: GrafanaTheme2) => ({
  badge: css({
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    padding: `${theme.spacing(0.25)} ${theme.spacing(0.75)}`,
    backgroundColor: theme.colors.background.secondary,
    border: `1px solid ${theme.colors.border.weak}`,
    borderRadius: theme.shape.radius.pill,
    cursor: 'pointer',
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.text.secondary,
    position: 'relative',
    transition: 'all 0.2s ease',

    '&:hover': {
      backgroundColor: theme.colors.action.hover,
      color: theme.colors.text.primary,
    },

    '&[data-has-unresolved="true"]': {
      borderColor: theme.colors.warning.border,
      color: theme.colors.warning.text,
    },
  }),
  count: css({
    fontWeight: theme.typography.fontWeightMedium,
  }),
  dot: css({
    position: 'absolute',
    top: '-2px',
    right: '-2px',
    width: '8px',
    height: '8px',
    backgroundColor: theme.colors.warning.main,
    borderRadius: '50%',
    border: `2px solid ${theme.colors.background.primary}`,
  }),
});
