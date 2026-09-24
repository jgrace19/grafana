import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { alertManagerRoutingStyles } from './AlertManagerRouting.stylex';
import { useFormContext } from 'react-hook-form';

import { Trans, t } from '@grafana/i18n';
import { CollapsableSection, Stack, Text } from '@grafana/ui';
import { type RuleFormValues } from 'app/features/alerting/unified/types/rule-form';
import { type AlertManagerDataSource } from 'app/features/alerting/unified/utils/datasource';
import { DOCS_URL_GROUP_ALERT_NOTIFICATIONS } from 'app/features/alerting/unified/utils/docs';

import { NeedHelpInfo } from '../../NeedHelpInfo';

import { ContactPointSelector } from './contactPoint/ContactPointSelector';
import { ActiveTimingFields } from './route-settings/ActiveTimingFields';
import { MuteTimingFields } from './route-settings/MuteTimingFields';
import { RoutingSettings } from './route-settings/RouteSettings';

interface AlertManagerManualRoutingProps {
  alertManager: AlertManagerDataSource;
}

export function AlertManagerManualRouting({ alertManager }: AlertManagerManualRoutingProps) {

  const alertManagerName = alertManager.name;

  const { watch } = useFormContext<RuleFormValues>();

  const hasRouteSettings =
    watch(`contactPoints.${alertManagerName}.overrideGrouping`) ||
    watch(`contactPoints.${alertManagerName}.overrideTimings`) ||
    watch(`contactPoints.${alertManagerName}.muteTimeIntervals`)?.length > 0;

  return (
    <Stack direction="column">
      <Stack direction="row" alignItems="center">
        <div {...stylex.props(alertManagerRoutingStyles.firstAlertManagerLine)} />
        <div {...stylex.props(alertManagerRoutingStyles.alertManagerName)}>
          <Trans i18nKey="alerting.rule-form.simple-routing.alertmanager-label">Alertmanager:</Trans>
          <img src={alertManager.imgUrl} alt="Alert manager logo" {...stylex.props(alertManagerRoutingStyles.img)} />
          {alertManagerName}
        </div>
        <div {...stylex.props(alertManagerRoutingStyles.secondAlertManagerLine)} />
      </Stack>
      <Stack direction="row" gap={1} alignItems="center">
        <ContactPointSelector alertManager={alertManagerName} />
      </Stack>
      {/* @TODO
        we can show the contact point details here when it's selected but we currently don't have a
        way to summarize the details from the ContactPoint type in @grafana/alerting
      */}
      <div {...stylex.props(alertManagerRoutingStyles.routingSection)}>
        <CollapsableSection
          label={t(
            'alerting.alert-manager-manual-routing.label-muting-grouping-and-timings-optional',
            'Muting, grouping and timings (optional)'
          )}
          isOpen={hasRouteSettings}
          {...stylex.props(alertManagerRoutingStyles.collapsableSection)}
          contentClassName={alertManagerRoutingStyles.collapsableSectionContent}
        >
          <Stack direction="column" gap={1}>
            <Stack direction="row" gap={0.5} alignItems="center">
              <Text variant="bodySmall" color="secondary">
                <Trans i18nKey="alerting.rule-form.simple-routing.optional-settings.description">
                  Configure how notifications for this alert rule are sent.
                </Trans>
              </Text>
              <NeedHelpInfo
                title={t(
                  'alerting.alert-manager-manual-routing.title-muting-grouping-and-timings',
                  'Muting, grouping, and timings'
                )}
                linkText={'Read about notification grouping'}
                externalLink={DOCS_URL_GROUP_ALERT_NOTIFICATIONS}
                contentText={
                  <>
                    <p>
                      {t(
                        'alerting.rule-form.simple-routing.optional-settings.help-info1',
                        'Mute timings allows you to temporarily pause notifications for a specific recurring period, such as a regular maintenance window or weekends.'
                      )}
                    </p>
                    {t(
                      'alerting.rule-form.simple-routing.optional-settings.help-info2',
                      'Grouping and timing options combine multiple alerts within a specific period into a single notification, allowing you to customize default options.'
                    )}
                  </>
                }
              />
            </Stack>
            <MuteTimingFields alertmanager={alertManagerName} />
            <ActiveTimingFields alertmanager={alertManagerName} />
            <RoutingSettings alertManager={alertManagerName} />
          </Stack>
        </CollapsableSection>
      </div>
    </Stack>
  );
}

