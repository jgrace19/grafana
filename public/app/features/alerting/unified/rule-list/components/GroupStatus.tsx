import * as stylex from '@stylexjs/stylex';

import { t } from '@grafana/i18n';
import { Icon, Tooltip } from '@grafana/ui';

interface GroupStatusProps {
  status: 'deleting'; // We don't support other statuses yet
}

export function GroupStatus({ status }: GroupStatusProps) {

  return (
    <div {...stylex.props(groupStatusStyles.container)}>
      <div {...stylex.props(groupStatusStyles.loader)} />
      {status === 'deleting' && (
        <Tooltip content={t('alerting.group-status.content-the-group-is-being-deleted', 'The group is being deleted')}>
          <div {...stylex.props(groupStatusStyles.iconWrapper)}>
            <Icon name="trash-alt" size="sm" />
          </div>
        </Tooltip>
      )}
    </div>
  );
}

const rotation = keyframes({
  '0%': {
    transform: 'rotate(0deg)',
  },
  '100%': {
    transform: 'rotate(360deg)',
  },
});

