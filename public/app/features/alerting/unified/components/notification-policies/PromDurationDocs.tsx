import * as stylex from '@stylexjs/stylex';

import { Trans } from '@grafana/i18n';
import { spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

import { TimeOptions } from '../../types/time';

export function PromDurationDocs() {
  return (
    <div>
      <Trans i18nKey="alerting.prom-duration-docs.explanation">
        Prometheus duration format consist of a number followed by a time unit.
      </Trans>
      <br />
      <Trans i18nKey="alerting.prom-duration-docs.different-units">
        Different units can be combined for more granularity.
      </Trans>
      <hr />
      <div {...stylex.props(styles.list)}>
        <div {...stylex.props(styles.header)}>
          <div>
            <Trans i18nKey="alerting.prom-duration-docs.symbol">Symbol</Trans>
          </div>
          <div>
            <Trans i18nKey="alerting.prom-duration-docs.time-unit">Time unit</Trans>
          </div>
          <div>
            <Trans i18nKey="alerting.prom-duration-docs.example">Example</Trans>
          </div>
        </div>
        <PromDurationDocsTimeUnit unit={TimeOptions.seconds} name="seconds" example="20s" />
        <PromDurationDocsTimeUnit unit={TimeOptions.minutes} name="minutes" example="10m" />
        <PromDurationDocsTimeUnit unit={TimeOptions.hours} name="hours" example="4h" />
        <PromDurationDocsTimeUnit unit={TimeOptions.days} name="days" example="3d" />
        <PromDurationDocsTimeUnit unit={TimeOptions.weeks} name="weeks" example="2w" />
        <div {...stylex.props(styles.examples)}>
          <div {...stylex.props(styles.examplesLabel)}>
            <Trans i18nKey="alerting.prom-duration-docs.multiple-units-combined">Multiple units combined</Trans>
          </div>
          {/* eslint-disable-next-line @grafana/i18n/no-untranslated-strings */}
          <code>1m30s, 2h30m20s, 1w2d</code>
        </div>
      </div>
    </div>
  );
}

function PromDurationDocsTimeUnit({ unit, name, example }: { unit: TimeOptions; name: string; example: string }) {
  return (
    <>
      <div {...stylex.props(styles.unit)}>{unit}</div>
      <div>{name}</div>
      <code>{example}</code>
    </>
  );
}

const styles = stylex.create({
  unit: {
    fontWeight: typography['--gf-typography-font-weight-bold'],
  },
  list: {
    display: 'grid',
    gridTemplateColumns: 'max-content 1fr 2fr',
    rowGap: spacing['--gf-spacing-x1'],
    columnGap: spacing['--gf-spacing-x3'],
  },
  header: {
    display: 'contents',
    fontWeight: typography['--gf-typography-font-weight-bold'],
  },
  examples: {
    display: 'contents',
  },
  examplesLabel: {
    gridColumnStart: 1,
    gridColumnEnd: 'span 2',
  },
});
