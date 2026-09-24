import * as stylex from '@stylexjs/stylex';
import { type ReactNode, useCallback, useState } from 'react';

import { type DataQueryError } from '@grafana/data';
import { Trans } from '@grafana/i18n';
import { Alert, type AlertVariant, Button } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { breakpointWidths } from '@grafana/ui/stylex/constants.stylex';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

import './SupplementaryResultError.css';

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

  const dismiss = useCallback(() => {
    setDismissed(true);
  }, []);

  const handleRemove = dismissable ? dismiss : onRemove;

  if (dismissed) {
    return null;
  }

  return (
    <div {...stylex.props(styles.supplementaryErrorContainer)}>
      <Alert title={title} severity={severity} onRemove={handleRemove}>
        {showButton ? (
          <div
            {...mergeStylexProps(stylex.props(styles.messageWrapper), {
              className: 'gf-explore-supplementary-message',
            })}
          >
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
          <div
            {...mergeStylexProps(stylex.props(styles.messageWrapper, styles.suggestedActionWrapper), {
              className: 'gf-explore-supplementary-message',
            })}
          >
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

const styles = stylex.create({
  supplementaryErrorContainer: {
    width: '60%',
    minWidth: breakpointWidths.sm,
    maxWidth: breakpointWidths.md,
    marginTop: 0,
    marginRight: 'auto',
    marginBottom: 0,
    marginLeft: 'auto',
  },
  messageWrapper: {
    minHeight: spacing['--gf-spacing-x3'],
  },
  suggestedActionWrapper: {
    paddingBottom: spacing['--gf-spacing-x5'],
  },
});
