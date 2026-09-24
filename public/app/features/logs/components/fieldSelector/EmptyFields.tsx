import * as stylex from '@stylexjs/stylex';

import { Trans } from '@grafana/i18n';
import { spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

export function EmptyFields() {
  return (
    <div {...stylex.props(styles.empty)}>
      <Trans i18nKey="explore.logs-table-empty-fields.no-fields">No fields</Trans>
    </div>
  );
}

const styles = stylex.create({
  empty: {
    marginBottom: spacing['--gf-spacing-x2'],
    marginLeft: `calc(${spacing['--gf-spacing-grid-size']} * 1.75)`,
    fontSize: typography['--gf-typography-font-size'],
  },
});
