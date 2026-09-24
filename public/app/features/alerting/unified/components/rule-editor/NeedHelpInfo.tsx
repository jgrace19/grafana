import * as stylex from '@stylexjs/stylex';
import type { JSX } from 'react';

import { Trans } from '@grafana/i18n';
import { Icon, Stack, Text, Toggletip } from '@grafana/ui';
import { colors, typography } from '@grafana/ui/stylex/tokens.stylex';

interface NeedHelpInfoProps {
  contentText: string | JSX.Element;
  externalLink?: string;
  linkText?: string;
  title?: string;
}
export function NeedHelpInfo({ contentText, externalLink, linkText, title = 'Need help?' }: NeedHelpInfoProps) {
  return (
    <Toggletip
      content={<div {...stylex.props(styles.mutedText)}>{contentText}</div>}
      title={
        <Stack gap={0.5} direction="row" alignItems="center">
          <Icon name="question-circle" />
          {title}
        </Stack>
      }
      footer={
        externalLink ? (
          <a href={externalLink} target="_blank" rel="noreferrer">
            <Stack direction="row" gap={0.5} alignItems="center">
              <Text color="link">
                {linkText} <Icon size="sm" name="external-link-alt" />
              </Text>
            </Stack>
          </a>
        ) : undefined
      }
      closeButton={true}
      placement="bottom-start"
    >
      <div {...stylex.props(styles.helpInfo)}>
        <Stack direction="row" alignItems="center" gap={0.5}>
          <Icon name="question-circle" size="sm" />
          <Text variant="bodySmall" color="primary">
            <Trans i18nKey="alerting.need-help-info.need-help">Need help?</Trans>
          </Text>
        </Stack>
      </div>
    </Toggletip>
  );
}

const styles = stylex.create({
  mutedText: {
    color: colors['--gf-colors-text-secondary'],
    fontSize: typography['--gf-typography-size-sm'],
  },
  helpInfo: {
    cursor: 'pointer',
    textDecorationLine: 'underline',
  },
});
