import * as stylex from '@stylexjs/stylex';

import { Trans, t } from '@grafana/i18n';
import { LinkButton } from '@grafana/ui';
import { contextSrv } from 'app/core/services/context_srv';
import { AlertState, type AlertmanagerAlert } from 'app/plugins/datasource/alertmanager/types';
import { AccessControlAction } from 'app/types/accessControl';

import { AlertmanagerAction } from '../../hooks/useAbilities';
import { isGrafanaRulesSource } from '../../utils/datasource';
import { makeAMLink, makeLabelBasedSilenceLink } from '../../utils/misc';
import { AnnotationDetailsField } from '../AnnotationDetailsField';
import { Authorize } from '../Authorize';

interface AmNotificationsAlertDetailsProps {
  alertManagerSourceName: string;
  alert: AlertmanagerAlert;
}

export const AlertDetails = ({ alert, alertManagerSourceName }: AmNotificationsAlertDetailsProps) => {

  // For Grafana Managed alerts the Generator URL redirects to the alert rule edit page, so update permission is required
  // For external alert manager the Generator URL redirects to an external service which we don't control
  const isGrafanaSource = isGrafanaRulesSource(alertManagerSourceName);
  const isSeeSourceButtonEnabled = isGrafanaSource
    ? contextSrv.hasPermission(AccessControlAction.AlertingRuleRead)
    : true;

  return (
    <>
      <div {...stylex.props(alertDetailsStyles.actionsRow)}>
        {alert.status.state === AlertState.Suppressed && (
          <Authorize actions={[AlertmanagerAction.CreateSilence, AlertmanagerAction.UpdateSilence]}>
            <LinkButton
              href={`${makeAMLink(
                '/alerting/silences',
                alertManagerSourceName
              )}&silenceIds=${alert.status.silencedBy.join(',')}`}
              {...stylex.props(alertDetailsStyles.button)}
              icon={'bell'}
              size={'sm'}
            >
              <Trans i18nKey="alerting.alert-details.manage-silences">Manage silences</Trans>
            </LinkButton>
          </Authorize>
        )}
        {alert.status.state === AlertState.Active && (
          <Authorize actions={[AlertmanagerAction.CreateSilence]}>
            <LinkButton
              href={makeLabelBasedSilenceLink(alertManagerSourceName, alert.labels)}
              {...stylex.props(alertDetailsStyles.button)}
              icon={'bell-slash'}
              size={'sm'}
            >
              <Trans i18nKey="alerting.alert-details.silence">Silence</Trans>
            </LinkButton>
          </Authorize>
        )}
        {isSeeSourceButtonEnabled && alert.generatorURL && (
          <LinkButton {...stylex.props(alertDetailsStyles.button)} href={alert.generatorURL} icon={'chart-line'} size={'sm'}>
            {isGrafanaSource
              ? t('alerting.alert-details.button-see-rule', 'See alert rule')
              : t('alerting.alert-details.button-see-source', 'See source')}
          </LinkButton>
        )}
      </div>
      {Object.entries(alert.annotations).map(([annotationKey, annotationValue]) => (
        <AnnotationDetailsField key={annotationKey} annotationKey={annotationKey} value={annotationValue} />
      ))}
      <div {...stylex.props(alertDetailsStyles.receivers)}>
        <Trans
          i18nKey="alerting.alert-details.receivers-list"
          values={{
            receivers: alert.receivers
              .map(({ name }) => name)
              .filter((name) => !!name)
              .join(', '),
          }}
        >
          Receivers: {'{{receivers}}'}
        </Trans>
      </div>
    </>
  );
};

