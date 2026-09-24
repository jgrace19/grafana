import * as stylex from '@stylexjs/stylex';
import { useForm, Controller } from 'react-hook-form';
import { useWindowSize } from 'react-use';

import { type SelectableValue } from '@grafana/data';
import { selectors as e2eSelectors } from '@grafana/e2e-selectors';
import { Trans, t } from '@grafana/i18n';
import { FieldSet, Button, ButtonGroup, Field, Input, RadioButtonGroup, Spinner } from '@grafana/ui';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';
import { contextSrv } from 'app/core/services/context_srv';
import {
  useAddRecipientMutation,
  useDeleteRecipientMutation,
  useGetPublicDashboardQuery,
  useReshareAccessToRecipientMutation,
  useUpdatePublicDashboardAccessMutation,
} from 'app/features/dashboard/api/publicDashboardApi';
import { type DashboardModel } from 'app/features/dashboard/state/DashboardModel';
import { DashboardScene } from 'app/features/dashboard-scene/scene/DashboardScene';
import { DashboardInteractions } from 'app/features/dashboard-scene/utils/interactions';
import { AccessControlAction } from 'app/types/accessControl';

import { type PublicDashboard, PublicDashboardShareType, validEmailRegex } from '../SharePublicDashboardUtils';

interface EmailSharingConfigurationForm {
  shareType: PublicDashboardShareType;
  email: string;
}

const selectors = e2eSelectors.pages.ShareDashboardModal.PublicDashboard.EmailSharingConfiguration;

const EmailList = ({
  recipients,
  dashboardUid,
  publicDashboardUid,
}: {
  recipients: PublicDashboard['recipients'];
  dashboardUid: string;
  publicDashboardUid: string;
}) => {
  const [deleteEmail, { isLoading: isDeleteLoading }] = useDeleteRecipientMutation();
  const [reshareAccess, { isLoading: isReshareLoading }] = useReshareAccessToRecipientMutation();

  const isLoading = isDeleteLoading || isReshareLoading;

  const onDeleteEmail = (recipientUid: string, recipientEmail: string) => {
    DashboardInteractions.revokePublicDashboardEmailClicked();
    deleteEmail({ recipientUid, recipientEmail, dashboardUid: dashboardUid, uid: publicDashboardUid });
  };

  const onReshare = (recipientUid: string) => {
    DashboardInteractions.resendPublicDashboardEmailClicked();
    reshareAccess({ recipientUid, uid: publicDashboardUid });
  };

  return (
    <table {...stylex.props(styles.table)} data-testid={selectors.EmailSharingList}>
      <tbody {...stylex.props(styles.tableBody)}>
        {recipients!.map((recipient, idx) => (
          <tr key={recipient.uid} {...stylex.props(styles.tableRow)}>
            <td>{recipient.recipient}</td>
            <td>
              <ButtonGroup className={stylex.props(styles.tableButtonsContainer).className}>
                <Button
                  type="button"
                  variant="destructive"
                  fill="text"
                  title={t('public-dashboard.email-sharing.revoke-button-title', 'Revoke')}
                  size="sm"
                  disabled={isLoading}
                  onClick={() => onDeleteEmail(recipient.uid, recipient.recipient)}
                  data-testid={`${selectors.DeleteEmail}-${idx}`}
                >
                  <Trans i18nKey="public-dashboard.email-sharing.revoke-button">Revoke</Trans>
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  fill="text"
                  title={t('public-dashboard.email-sharing.resend-button-title', 'Resend')}
                  size="sm"
                  disabled={isLoading}
                  onClick={() => onReshare(recipient.uid)}
                  data-testid={`${selectors.ReshareLink}-${idx}`}
                >
                  <Trans i18nKey="public-dashboard.email-sharing.resend-button">Resend</Trans>
                </Button>
              </ButtonGroup>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export const EmailSharingConfiguration = ({ dashboard }: { dashboard: DashboardModel | DashboardScene }) => {
  const { width } = useWindowSize();

  const dashboardUid = dashboard instanceof DashboardScene ? dashboard.state.uid : dashboard.uid;
  const { data: publicDashboard } = useGetPublicDashboardQuery(dashboardUid);
  const [updateShareType] = useUpdatePublicDashboardAccessMutation();
  const [addEmail, { isLoading: isAddEmailLoading }] = useAddRecipientMutation();

  const hasWritePermissions = contextSrv.hasPermission(AccessControlAction.DashboardsPublicWrite);

  const {
    register,
    setValue,
    control,
    watch,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmailSharingConfigurationForm>({
    defaultValues: {
      shareType: publicDashboard?.share || PublicDashboardShareType.PUBLIC,
      email: '',
    },
    mode: 'onSubmit',
  });

  const onUpdateShareType = (shareType: PublicDashboardShareType) => {
    const req = {
      dashboard,
      payload: {
        ...publicDashboard!,
        share: shareType,
      },
    };

    updateShareType(req);
  };

  const onSubmit = async (data: EmailSharingConfigurationForm) => {
    DashboardInteractions.publicDashboardEmailInviteClicked();
    await addEmail({ recipient: data.email, uid: publicDashboard!.uid, dashboardUid }).unwrap();
    reset({ email: '', shareType: PublicDashboardShareType.EMAIL });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldSet
        disabled={!hasWritePermissions}
        data-testid={selectors.Container}
        className={stylex.props(styles.container).className}
      >
        <Field
          label={t('public-dashboard.config.can-view-dashboard-radio-button-label', 'Can view dashboard')}
          xstyle={styles.field}
        >
          <Controller
            name="shareType"
            control={control}
            render={({ field }) => {
              const { ref, ...rest } = field;
              const options: Array<SelectableValue<PublicDashboardShareType>> = [
                {
                  label: t('public-dashboard.config.public-share-type-option-label', 'Anyone with a link'),
                  value: PublicDashboardShareType.PUBLIC,
                },
                {
                  label: t('public-dashboard.config.email-share-type-option-label', 'Only specified people'),
                  value: PublicDashboardShareType.EMAIL,
                },
              ];
              return (
                <RadioButtonGroup
                  {...rest}
                  size={width < 480 ? 'sm' : 'md'}
                  options={options}
                  onChange={(shareType: PublicDashboardShareType) => {
                    DashboardInteractions.publicDashboardShareTypeChange({
                      shareType: shareType === PublicDashboardShareType.EMAIL ? 'email' : 'public',
                    });
                    setValue('shareType', shareType);
                    onUpdateShareType(shareType);
                  }}
                />
              );
            }}
          />
        </Field>
        {watch('shareType') === PublicDashboardShareType.EMAIL && (
          <>
            <Field
              label={t('public-dashboard.email-sharing.invite-field-label', 'Invite')}
              description={t('public-dashboard.email-sharing.invite-field-desc', 'Invite people by email')}
              error={errors.email?.message}
              invalid={!!errors.email?.message || undefined}
              xstyle={styles.field}
            >
              <div {...stylex.props(styles.emailContainer)}>
                <Input
                  className={stylex.props(styles.emailInput).className}
                  // eslint-disable-next-line @grafana/i18n/no-untranslated-strings
                  placeholder="me@example.com"
                  autoCapitalize="none"
                  {...register('email', {
                    required: t('public-dashboard.email-sharing.input-required-email-text', 'Email is required'),
                    pattern: {
                      value: validEmailRegex,
                      message: t('public-dashboard.email-sharing.input-invalid-email-text', 'Invalid email'),
                    },
                  })}
                  data-testid={selectors.EmailSharingInput}
                />
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isAddEmailLoading}
                  data-testid={selectors.EmailSharingInviteButton}
                >
                  <Trans i18nKey="public-dashboard.email-sharing.invite-button">Invite</Trans>
                  {isAddEmailLoading && <Spinner />}
                </Button>
              </div>
            </Field>
            {!!publicDashboard?.recipients?.length && (
              <EmailList
                recipients={publicDashboard.recipients}
                dashboardUid={dashboardUid}
                publicDashboardUid={publicDashboard.uid}
              />
            )}
          </>
        )}
      </FieldSet>
    </form>
  );
};

const styles = stylex.create({
  field: {
    marginBottom: 0,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    gap: spacing['--gf-spacing-x3'],
  },
  emailContainer: {
    display: 'flex',
    gap: spacing['--gf-spacing-x1'],
  },
  emailInput: {
    flexGrow: 1,
  },
  table: {
    display: 'flex',
    maxHeight: '220px',
    overflowY: 'scroll',
  },
  tableBody: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  tableRow: {
    minHeight: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing['--gf-spacing-x0-5'],
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x0-5'],
    paddingLeft: spacing['--gf-spacing-x1'],
    backgroundColor: { default: null, ':nth-child(odd)': colors['--gf-colors-background-secondary'] },
  },
  tableButtonsContainer: {
    display: 'flex',
    justifyContent: 'end',
  },
});
