
import { Trans } from '@grafana/i18n';
import { } from '@grafana/ui';

export function ToLabel() {
  const styles = (getStyles);
  return (
    <div {...stylex.props(toLabelStyles.button)}>
      <Trans i18nKey="alerting.threshold.to">TO</Trans>
    </div>
  );
}

