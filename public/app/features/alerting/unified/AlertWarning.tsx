import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { Trans } from '@grafana/i18n';
import { Alert, LinkButton } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

interface AlertWarningProps {
  title: string;
  children: React.ReactNode;
}
export function AlertWarning({ title, children }: AlertWarningProps) {
  // Alert's own vertical margins beat a class, so they go through its spacing props.
  return (
    <Alert
      className={stylex.props(styles.warning).className}
      severity="warning"
      title={title}
      topSpacing={4}
      bottomSpacing={4}
    >
      <p>{children}</p>
      <LinkButton href="alerting/list">
        <Trans i18nKey="alerting.alert-warning.to-rule-list">To rule list</Trans>
      </LinkButton>
    </Alert>
  );
}

const styles = stylex.create({
  warning: {
    marginLeft: spacing['--gf-spacing-x4'],
    marginRight: spacing['--gf-spacing-x4'],
  },
});
