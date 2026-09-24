
import { Trans } from '@grafana/i18n';
import { } from '@grafana/ui';


export function EmptyFields() {
  const styles = (getStyles);
  return (
    <div {...stylex.props(emptyFieldsStyles.empty)}>
      <Trans i18nKey="explore.logs-table-empty-fields.no-fields">No fields</Trans>
    </div>
  );
}
