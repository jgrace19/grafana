
import { Alert, type AlertVariant, Icon, Link, Stack, Text, } from '@grafana/ui';

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
  const styles = (getStyles);

  return (
    <Alert severity={severity} title="" aria-label={description}>
      <Stack direction="row" justifyContent={'space-between'}>
        <Text>{description}</Text>
        {link && (
          <Link href={link.href} {...stylex.props(stepResultAlertStyles.link)}>
            {link.text}
            <Icon name="external-link-alt" size="md" aria-hidden={true} {...stylex.props(stepResultAlertStyles.linkIcon)} />
          </Link>
        )}
      </Stack>
      {help && <Text variant={'bodySmall'}>{help}</Text>}
    </Alert>
  );
}

