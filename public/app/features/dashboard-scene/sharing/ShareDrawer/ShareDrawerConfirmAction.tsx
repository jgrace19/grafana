import * as stylex from '@stylexjs/stylex';

import { t } from '@grafana/i18n';
import { IconButton, Spinner, Stack, Text } from '@grafana/ui';
import { ConfirmContent, type ConfirmContentProps } from '@grafana/ui/internal';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

export function ShareDrawerConfirmAction({
  onConfirm,
  onDismiss,
  description,
  confirmButtonLabel,
  title,
  isActionLoading,
}: { title: string; isActionLoading: boolean } & Pick<
  ConfirmContentProps,
  'description' | 'onConfirm' | 'onDismiss' | 'confirmButtonLabel'
>) {
  const ConfirmBody = () => (
    <div {...stylex.props(styles.bodyContainer)}>
      <Stack justifyContent="space-between">
        <Stack gap={1} alignItems="center">
          <IconButton
            size="xl"
            name="angle-left"
            aria-label={t('share-drawer.confirm-action.back-arrow-button', 'Back button')}
            onClick={onDismiss}
          />
          <Text variant="h4">{title}</Text>
        </Stack>
        {isActionLoading && <Spinner />}
      </Stack>
    </div>
  );

  return (
    <ConfirmContent
      body={<ConfirmBody />}
      description={description}
      confirmButtonLabel={confirmButtonLabel}
      confirmButtonVariant="destructive"
      dismissButtonLabel={t('share-drawer.confirm-action.cancel-button', 'Cancel')}
      dismissButtonVariant="secondary"
      justifyButtons="flex-start"
      onConfirm={onConfirm}
      onDismiss={onDismiss}
    />
  );
}

const styles = stylex.create({
  bodyContainer: {
    marginBottom: spacing['--gf-spacing-x2'],
  },
});
