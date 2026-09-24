import * as stylex from '@stylexjs/stylex';
import { promDurationDocsStyles } from './PromDurationDocs.stylex';

import { Trans } from '@grafana/i18n';

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
      <div {...stylex.props(formStyles.list)}>
        <div {...stylex.props(formStyles.header)}>
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
        <div {...stylex.props(formStyles.examples)}>
          <div>
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
      <div {...stylex.props(formStyles.unit)}>{unit}</div>
      <div>{name}</div>
      <code>{example}</code>
    </>
  );
}

