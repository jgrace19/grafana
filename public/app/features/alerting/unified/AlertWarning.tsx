import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { alertWarningStyles } from './AlertWarning.stylex';
import * as React from 'react';

import { Trans } from '@grafana/i18n';
import { Alert, LinkButton } from '@grafana/ui';

interface AlertWarningProps {
  title: string;
  children: React.ReactNode;
}
export function AlertWarning({ title, children }: AlertWarningProps) {
  return (
    <Alert {...stylex.props(alertWarningStyles.warning)} severity="warning" title={title}>
      <p>{children}</p>
      <LinkButton href="alerting/list">
        <Trans i18nKey="alerting.alert-warning.to-rule-list">To rule list</Trans>
      </LinkButton>
    </Alert>
  );
}

