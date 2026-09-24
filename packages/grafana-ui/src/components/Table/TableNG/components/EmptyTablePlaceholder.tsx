import * as stylex from '@stylexjs/stylex';

import { Trans } from '@grafana/i18n';

import { colors } from '../../../../themes/stylex/tokens.stylex';

export function EmptyTablePlaceholder({ noValue }: { noValue?: string }) {
  return (
    <div {...stylex.props(styles.placeholder)}>
      {noValue ?? <Trans i18nKey="grafana-ui.table.no-rows">No rows</Trans>}
    </div>
  );
}

const styles = stylex.create({
  placeholder: {
    gridColumnStart: 1,
    gridColumnEnd: -1,
    placeSelf: 'center',
    color: colors['--gf-colors-text-secondary'],
  },
});
