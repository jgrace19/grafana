import * as stylex from '@stylexjs/stylex';
import { useForm } from 'react-hook-form';

import { selectors as e2eSelectors } from '@grafana/e2e-selectors';
import { Trans, t } from '@grafana/i18n';
import { Button, Checkbox, FieldSet, Spinner, Stack } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';
import { contextSrv } from 'app/core/services/context_srv';
import { useCreatePublicDashboardMutation } from 'app/features/dashboard/api/publicDashboardApi';
import { PublicDashboardShareType } from 'app/features/dashboard/components/ShareModal/SharePublicDashboard/SharePublicDashboardUtils';
import { DashboardInteractions } from 'app/features/dashboard-scene/utils/interactions';
import { AccessControlAction } from 'app/types/accessControl';

import { EmailSharingPricingAlert } from '../../../../../dashboard/components/ShareModal/SharePublicDashboard/ModalAlerts/EmailSharingPricingAlert';
import { useShareDrawerContext } from '../../../ShareDrawer/ShareDrawerContext';

const selectors = e2eSelectors.pages.ShareDashboardDrawer.ShareExternally.Creation;

export const CreateEmailSharing = ({ hasError }: { hasError: boolean }) => {
  const { dashboard, onDismiss } = useShareDrawerContext();

  const [createPublicDashboard, { isLoading, isError }] = useCreatePublicDashboardMutation();

  const hasWritePermissions = contextSrv.hasPermission(AccessControlAction.DashboardsPublicWrite);
  const disableInputs = !hasWritePermissions || isLoading || isError || hasError;

  const {
    handleSubmit,
    register,
    formState: { isValid },
  } = useForm<{ billAcknowledgment: boolean }>({ mode: 'onChange' });

  const onCreate = () => {
    DashboardInteractions.generatePublicDashboardUrlClicked({ share: PublicDashboardShareType.EMAIL });
    createPublicDashboard({ dashboard, payload: { share: PublicDashboardShareType.EMAIL, isEnabled: true } });
  };

  return (
    <>
      {hasWritePermissions && <EmailSharingPricingAlert />}
      <form onSubmit={handleSubmit(onCreate)}>
        <FieldSet disabled={disableInputs}>
          <div {...stylex.props(styles.checkbox)}>
            <Checkbox
              {...register('billAcknowledgment', { required: true })}
              label={t('public-dashboard.email-sharing.bill-ack', 'I understand that adding users requires payment.*')}
            />
          </div>
          <Stack direction="row" gap={1} alignItems="center">
            <Button type="submit" disabled={!isValid} data-testid={selectors.EmailShare.createButton}>
              <Trans i18nKey="public-dashboard.email-sharing.accept-button">Accept</Trans>
            </Button>
            <Button variant="secondary" onClick={onDismiss} data-testid={selectors.EmailShare.cancelButton}>
              <Trans i18nKey="public-dashboard.email-sharing.cancel-button">Cancel</Trans>
            </Button>
            {isLoading && <Spinner />}
          </Stack>
        </FieldSet>
      </form>
    </>
  );
};

const styles = stylex.create({
  checkbox: {
    marginBottom: spacing['--gf-spacing-x2'],
  },
});
