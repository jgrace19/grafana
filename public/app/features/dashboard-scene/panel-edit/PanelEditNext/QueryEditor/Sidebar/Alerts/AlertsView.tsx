import * as stylex from '@stylexjs/stylex';

import { spacing } from '@grafana/ui/stylex/tokens.stylex';

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
      <div {...stylex.props(styles.container)}>
        <div {...stylex.props(styles.buttonWrapper)}>
          <ScenesNewRuleFromPanelButton panel={panel} variant="primary" size="sm" disabled={!isDashboardSaved} />
        </div>
      </div>
    );
  }

  return (
    <div {...stylex.props(styles.container)}>
      {alertRules.map((alert) => (
        <AlertCard key={alert.alertId} alert={alert} />
      ))}
      <div {...stylex.props(styles.buttonWrapper)}>
        <ScenesNewRuleFromPanelButton panel={panel} variant="primary" size="sm" />
      </div>
    </div>
  );
}

const styles = stylex.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing['--gf-spacing-x1'],
    marginTop: spacing['--gf-spacing-x3'],
  },
  buttonWrapper: {
    position: 'relative',
    marginInlineStart: spacing['--gf-spacing-x2'],
    minHeight: '30px',
  },
});
