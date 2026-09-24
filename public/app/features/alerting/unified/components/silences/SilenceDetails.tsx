import * as stylex from '@stylexjs/stylex';

import { Trans } from '@grafana/i18n';
import { Stack } from '@grafana/ui';

import { SilenceMetadataGrid } from './SilenceMetadataGrid';
import SilencedAlertsTable from './SilencedAlertsTable';
import { type SilenceTableItem } from './SilencesTable';

interface Props {
  silence: SilenceTableItem;
}

export const SilenceDetails = ({ silence }: Props) => {
  const { startsAt, endsAt, comment, createdBy, silencedAlerts } = silence;

  return (
    <Stack direction="column" gap={2}>
      <SilenceMetadataGrid {...{ startsAt, endsAt, comment, createdBy }} />
      {Array.isArray(silencedAlerts) && (
        <>
          <div {...stylex.props(silenceDetailsStyles.title)}>
            <Trans i18nKey="alerting.silence-details.affected-alerts">Affected alerts</Trans>
          </div>
          <SilencedAlertsTable silencedAlerts={silencedAlerts} />
        </>
      )}
    </Stack>
  );
};

