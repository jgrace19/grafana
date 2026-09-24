import * as stylex from '@stylexjs/stylex';

import { Trans } from '@grafana/i18n';
import { colors, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

export function ToLabel() {
  return (
    <div {...stylex.props(styles.button)}>
      <Trans i18nKey="alerting.threshold.to">TO</Trans>
    </div>
  );
}

const styles = stylex.create({
  button: {
    height: '32px',
    color: colors['--gf-colors-primary-text'],
    fontSize: typography['--gf-typography-body-small-font-size'],
    display: 'flex',
    alignItems: 'center',
    fontWeight: typography['--gf-typography-font-weight-bold'],
    paddingTop: 0,
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: 0,
    paddingLeft: spacing['--gf-spacing-x1'],
  },
});
