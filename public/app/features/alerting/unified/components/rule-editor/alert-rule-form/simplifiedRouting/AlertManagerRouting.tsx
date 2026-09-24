import * as stylex from '@stylexjs/stylex';
import { useFormContext } from 'react-hook-form';

import { Trans, t } from '@grafana/i18n';
import { CollapsableSection, Stack, Text } from '@grafana/ui';
import { colors, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';
import { type RuleFormValues } from 'app/features/alerting/unified/types/rule-form';
import { type AlertManagerDataSource } from 'app/features/alerting/unified/utils/datasource';
import { DOCS_URL_GROUP_ALERT_NOTIFICATIONS } from 'app/features/alerting/unified/utils/docs';

import { NeedHelpInfo } from '../../NeedHelpInfo';

import { ContactPointSelector } from './contactPoint/ContactPointSelector';
import { ActiveTimingFields } from './route-settings/ActiveTimingFields';
import { MuteTimingFields } from './route-settings/MuteTimingFields';
import { RoutingSettings } from './route-settings/RouteSettings';
import './AlertManagerRouting.css';

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
        <div {...stylex.props(styles.firstAlertManagerLine)} />
        <div {...stylex.props(styles.alertManagerName)}>
          <Trans i18nKey="alerting.rule-form.simple-routing.alertmanager-label">Alertmanager:</Trans>
          <img src={alertManager.imgUrl} alt="Alert manager logo" {...stylex.props(styles.img)} />
          {alertManagerName}
        </div>
        <div {...stylex.props(styles.secondAlertManagerLine)} />
      </Stack>
      <Stack direction="row" gap={1} alignItems="center">
        <ContactPointSelector alertManager={alertManagerName} />
      </Stack>
      {/* @TODO
        we can show the contact point details here when it's selected but we currently don't have a
        way to summarize the details from the ContactPoint type in @grafana/alerting
      */}
      <div {...stylex.props(styles.routingSection)}>
        <CollapsableSection
          label={t(
            'alerting.alert-manager-manual-routing.label-muting-grouping-and-timings-optional',
            'Muting, grouping and timings (optional)'
          )}
          isOpen={hasRouteSettings}
          className="gf-alerting-am-routing-settings"
          contentClassName="gf-alerting-am-routing-settings-content"
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

const styles = stylex.create({
  firstAlertManagerLine: {
    height: '1px',
    width: spacing['--gf-spacing-x4'],
    backgroundColor: colors['--gf-colors-secondary-main'],
  },
  alertManagerName: {
    width: 'fit-content',
  },
  secondAlertManagerLine: {
    height: '1px',
    width: '100%',
    flex: '1',
    backgroundColor: colors['--gf-colors-secondary-main'],
  },
  img: {
    marginLeft: spacing['--gf-spacing-x2'],
    width: spacing['--gf-spacing-x3'],
    height: spacing['--gf-spacing-x3'],
    marginRight: spacing['--gf-spacing-x1'],
  },
  routingSection: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '1200px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-weak'],
    borderRadius: shape['--gf-shape-radius-default'],
    paddingTop: spacing['--gf-spacing-x1'],
    paddingRight: spacing['--gf-spacing-x2'],
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: spacing['--gf-spacing-x2'],
    marginTop: spacing['--gf-spacing-x2'],
  },
});
