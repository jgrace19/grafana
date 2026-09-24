import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { alertsViewStyles } from './AlertsView.stylex';


import { ScenesNewRuleFromPanelButton } from '../../../../PanelDataPane/NewAlertRuleButton';
import { useAlertingContext, usePanelContext } from '../../QueryEditorContext';
import { type AlertRule } from '../../types';

import { AlertCard } from './AlertCard';

interface AlertsViewProps {
  alertRules: AlertRule[];
}

export function AlertsView({ alertRules }: AlertsViewProps) {
  const { panel } = usePanelContext();
  const { isDashboardSaved } = useAlertingContext();


  if (alertRules.length === 0) {
    return (
      <div {...stylex.props(alertsViewStyles.container)}>
        <div {...stylex.props(alertsViewStyles.buttonWrapper)}>
          <ScenesNewRuleFromPanelButton panel={panel} variant="primary" size="sm" disabled={!isDashboardSaved} />
        </div>
      </div>
    );
  }

  return (
    <div {...stylex.props(alertsViewStyles.container)}>
      {alertRules.map((alert) => (
        <AlertCard key={alert.alertId} alert={alert} />
      ))}
      <div {...stylex.props(alertsViewStyles.buttonWrapper)}>
        <ScenesNewRuleFromPanelButton panel={panel} variant="primary" size="sm" />
      </div>
    </div>
  );
}

