import * as stylex from '@stylexjs/stylex';

import { dateTimeFormat, intervalToAbbreviatedDurationString } from '@grafana/data';
import { Trans } from '@grafana/i18n';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';

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
    <div {...stylex.props(styles.container)}>
      <div {...stylex.props(styles.label)}>
        <Trans i18nKey="alerting.silence-details.comment">Comment</Trans>
      </div>
      <div>{comment}</div>
      <div {...stylex.props(styles.label)}>
        <Trans i18nKey="alerting.silence-details.schedule">Schedule</Trans>
      </div>
      <div>{`${startsAtDate} - ${endsAtDate}`}</div>
      <div {...stylex.props(styles.label)}>
        <Trans i18nKey="alerting.silence-details.duration">Duration</Trans>
      </div>
      <div>{duration}</div>
      <div {...stylex.props(styles.label)}>
        <Trans i18nKey="alerting.silence-details.created-by">Created by</Trans>
      </div>
      <div>{createdBy}</div>
    </div>
  );
}

const styles = stylex.create({
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 9fr',
    rowGap: '1rem',
    paddingBottom: spacing['--gf-spacing-x2'],
  },
  label: {
    color: colors['--gf-colors-text-primary'],
  },
});
