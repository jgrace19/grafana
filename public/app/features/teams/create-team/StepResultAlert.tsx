import * as stylex from '@stylexjs/stylex';

import { Alert, type AlertVariant, Icon, Link, Stack, Text } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

export interface StepResultAlertProps {
  severity: AlertVariant;
  description: string;
  help?: string;
  link?: ResultCardLink;
}

interface ResultCardLink {
  href: string;
  text: string;
}

/**
 * Alert that just shows the message and optional link. Link should point to some resource that the step successfully
 * created.
 */
export function StepResultAlert({ severity, description, link, help }: StepResultAlertProps) {
  return (
    <Alert severity={severity} title="" aria-label={description}>
      <Stack direction="row" justifyContent={'space-between'}>
        <Text>{description}</Text>
        {link && (
          <Link href={link.href} {...stylex.props(styles.link)}>
            {link.text}
            <Icon name="external-link-alt" size="md" aria-hidden={true} xstyle={styles.linkIcon} />
          </Link>
        )}
      </Stack>
      {help && <Text variant={'bodySmall'}>{help}</Text>}
    </Alert>
  );
}

const styles = stylex.create({
  link: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing['--gf-spacing-x1'],
  },

  linkIcon: {
    flexShrink: 0,
  },
});
