import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { supplementaryResultErrorStyles } from './SupplementaryResultError.stylex';
import { type ReactNode, useCallback, useState } from 'react';

import { type DataQueryError, type GrafanaTheme2 } from '@grafana/data';
import { Trans } from '@grafana/i18n';
import { Alert, type AlertVariant, Button, useTheme2 } from '@grafana/ui';

type Props = {
  error?: DataQueryError;
  message?: ReactNode;
  title: string;
  severity?: AlertVariant;
  suggestedAction?: string;
  onSuggestedAction?(): void;
  onRemove?(): void;
  dismissable?: boolean;
};
const SHORT_ERROR_MESSAGE_LIMIT = 100;
export function SupplementaryResultError(props: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const { dismissable, error, title, suggestedAction, onSuggestedAction, onRemove, severity = 'warning' } = props;
  // generic get-error-message-logic, taken from
  // /public/app/features/explore/ErrorContainer.tsx
  const message = props.message ?? error?.message ?? error?.data?.message ?? '';
  const showButton = typeof message === 'string' && message.length > SHORT_ERROR_MESSAGE_LIMIT;
  const theme = useTheme2();

  const dismiss = useCallback(() => {
    setDismissed(true);
  }, []);

  const handleRemove = dismissable ? dismiss : onRemove;

  if (dismissed) {
    return null;
  }

  return (
    <div {...stylex.props(supplementaryResultErrorStyles.supplementaryErrorContainer)}>
      <Alert title={title} severity={severity} onRemove={handleRemove}>
        {showButton ? (
          <div {...stylex.props(supplementaryResultErrorStyles.messageWrapper)}>
            {!isOpen ? (
              <Button
                variant="secondary"
                size="xs"
                onClick={() => {
                  setIsOpen(true);
                }}
              >
                <Trans i18nKey="explore.supplementary-result-error.show-details">Show details</Trans>
              </Button>
            ) : (
              message
            )}
          </div>
        ) : (
          <div className={`${mergeStylexClassName(stylex.props(supplementaryResultErrorStyles.messageWrapper), undefined).className} ${mergeStylexClassName(stylex.props(supplementaryResultErrorStyles.suggestedActionWrapper), undefined).className}`}>
            {message}
            {suggestedAction && onSuggestedAction && (
              <Button variant="primary" size="xs" onClick={onSuggestedAction}>
                {suggestedAction}
              </Button>
            )}
          </div>
        )}
      </Alert>
    </div>
  );
}

;
