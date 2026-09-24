// Core Grafana history https://github.com/grafana/grafana/blob/v11.0.0-preview/public/app/plugins/datasource/prometheus/querybuilder/components/metrics-modal/FeedbackLink.tsx
import * as stylex from '@stylexjs/stylex';

import { Trans, t } from '@grafana/i18n';
import { Icon, Stack } from '@grafana/ui';

import { feedbackLinkStyles } from './FeedbackLink.stylex';

interface Props {
  feedbackUrl?: string;
}

export function FeedbackLink({ feedbackUrl }: Props) {
  return (
    <Stack>
      <a
        href={feedbackUrl}
        {...stylex.props(feedbackLinkStyles.link)}
        title={t(
          'grafana-prometheus.querybuilder.feedback-link.title-give-feedback',
          'The metrics explorer is new, please let us know how we can improve it'
        )}
        target="_blank"
        rel="noreferrer noopener"
      >
        <Icon name="comment-alt-message" />{' '}
        <Trans i18nKey="grafana-prometheus.querybuilder.feedback-link.give-feedback">Give feedback</Trans>
      </a>
    </Stack>
  );
}
