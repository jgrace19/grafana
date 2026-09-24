import * as stylex from '@stylexjs/stylex';

import { Trans } from '@grafana/i18n';

interface SilenceMetadataGridProps {
  startsAt: string;
  endsAt: string;
  comment: string;
  createdBy: string;
}

export function SilenceMetadataGrid({ startsAt, endsAt, comment, createdBy }: SilenceMetadataGridProps) {
  const dateDisplayFormat = 'YYYY-MM-DD HH:mm';
  const startsAtDate = dateTimeFormat(startsAt, { format: dateDisplayFormat });
  const endsAtDate = dateTimeFormat(endsAt, { format: dateDisplayFormat });
  const duration = intervalToAbbreviatedDurationString({
    start: new Date(startsAt),
    end: new Date(endsAt),
  });

  return (
    <div {...stylex.props(silenceMetadataGridStyles.container)}>
      <div {...stylex.props(silenceMetadataGridStyles.label)}>
        <Trans i18nKey="alerting.silence-details.comment">Comment</Trans>
      </div>
      <div>{comment}</div>
      <div {...stylex.props(silenceMetadataGridStyles.label)}>
        <Trans i18nKey="alerting.silence-details.schedule">Schedule</Trans>
      </div>
      <div>{`${startsAtDate} - ${endsAtDate}`}</div>
      <div {...stylex.props(silenceMetadataGridStyles.label)}>
        <Trans i18nKey="alerting.silence-details.duration">Duration</Trans>
      </div>
      <div>{duration}</div>
      <div {...stylex.props(silenceMetadataGridStyles.label)}>
        <Trans i18nKey="alerting.silence-details.created-by">Created by</Trans>
      </div>
      <div>{createdBy}</div>
    </div>
  );
}

