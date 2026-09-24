import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { alertGroupStyles } from './AlertGroup.stylex';
import { useState } from 'react';

import { AlertLabels } from '@grafana/alerting/unstable';
import { Trans, t } from '@grafana/i18n';
import { Stack, TextLink, Tooltip } from '@grafana/ui';
import { type AlertmanagerGroup } from 'app/plugins/datasource/alertmanager/types';

import { useCanViewContactPoints } from '../../hooks/useAbilities';
import { createContactPointSearchLink } from '../../utils/misc';
import { CollapseToggle } from '../CollapseToggle';
import { MetaText } from '../MetaText';

import { AlertGroupAlertsTable } from './AlertGroupAlertsTable';
import { AlertGroupHeader } from './AlertGroupHeader';

interface Props {
  group: AlertmanagerGroup;
  alertManagerSourceName: string;
}

export const AlertGroup = ({ alertManagerSourceName, group }: Props) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const canViewContactPoint = useCanViewContactPoints();

  // When group is grouped, receiver.name is 'NONE' as it can contain multiple receivers
  const receiverInGroup = group.receiver.name !== 'NONE';
  const contactPoint = group.receiver.name;

  return (
    <div {...stylex.props(alertGroupStyles.wrapper)}>
      <div {...stylex.props(alertGroupStyles.header)}>
        <div {...stylex.props(alertGroupStyles.group)} data-testid="alert-group">
          <CollapseToggle
            size="sm"
            isCollapsed={isCollapsed}
            onToggle={() => setIsCollapsed(!isCollapsed)}
            data-testid="alert-group-collapse-toggle"
          />
          {Object.keys(group.labels).length ? (
            <Stack direction="row" alignItems="center">
              <AlertLabels labels={group.labels} size="sm" />

              {receiverInGroup && (
                <MetaText icon="at">
                  {canViewContactPoint ? (
                    <Trans i18nKey="alerting.alert-group.delivered-to" values={{ name: group.receiver.name }}>
                      Delivered to{' '}
                      <TextLink
                        href={createContactPointSearchLink(contactPoint, alertManagerSourceName)}
                        variant="bodySmall"
                        color="primary"
                        inline={false}
                      >
                        {'{{name}}'}
                      </TextLink>
                    </Trans>
                  ) : (
                    <Tooltip
                      content={t(
                        'alerting.alert-group.view-contact-point-no-permission',
                        'You do not have permission to view contact points'
                      )}
                    >
                      <span>
                        {t('alerting.alert-group.delivered-to-disabled', 'Delivered to {{name}}', {
                          name: contactPoint,
                        })}
                      </span>
                    </Tooltip>
                  )}
                </MetaText>
              )}
            </Stack>
          ) : (
            <span>
              <Trans i18nKey="alerting.alert-group.no-grouping">No grouping</Trans>
            </span>
          )}
        </div>
        <AlertGroupHeader group={group} />
      </div>
      {!isCollapsed && <AlertGroupAlertsTable alertManagerSourceName={alertManagerSourceName} alerts={group.alerts} />}
    </div>
  );
};

