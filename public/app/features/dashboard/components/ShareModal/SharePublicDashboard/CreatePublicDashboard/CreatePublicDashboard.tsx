import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { createPublicDashboardStyles } from './CreatePublicDashboard.stylex';
import { useForm } from 'react-hook-form';

import { selectors as e2eSelectors } from '@grafana/e2e-selectors';
import { Trans } from '@grafana/i18n';
import { Button, Spinner, useStyles2 } from '@grafana/ui';
import { contextSrv } from 'app/core/services/context_srv';
import { useCreatePublicDashboardMutation } from 'app/features/dashboard/api/publicDashboardApi';
import { type DashboardModel } from 'app/features/dashboard/state/DashboardModel';
import { type DashboardScene } from 'app/features/dashboard-scene/scene/DashboardScene';
import { DashboardInteractions } from 'app/features/dashboard-scene/utils/interactions';
import { AccessControlAction } from 'app/types/accessControl';
import { useSelector } from 'app/types/store';

import { NoUpsertPermissionsAlert } from '../ModalAlerts/NoUpsertPermissionsAlert';
import { UnsupportedDataSourcesAlert } from '../ModalAlerts/UnsupportedDataSourcesAlert';
import { UnsupportedTemplateVariablesAlert } from '../ModalAlerts/UnsupportedTemplateVariablesAlert';
import { dashboardHasTemplateVariables } from '../SharePublicDashboardUtils';
import { useGetUnsupportedDataSources } from '../useGetUnsupportedDataSources';

import { AcknowledgeCheckboxes } from './AcknowledgeCheckboxes';

const selectors = e2eSelectors.pages.ShareDashboardModal.PublicDashboard;

export type SharePublicDashboardAcknowledgmentInputs = {
  publicAcknowledgment: boolean;
  dataSourcesAcknowledgment: boolean;
  usageAcknowledgment: boolean;
};

interface CreatePublicDashboarBaseProps {
  unsupportedDatasources?: string[];
  unsupportedTemplateVariables?: boolean;
  dashboard: DashboardModel | DashboardScene;
  hasError?: boolean;
}

export const CreatePublicDashboardBase = ({
  unsupportedDatasources = [],
  unsupportedTemplateVariables = false,
  dashboard,
  hasError = false,
}: CreatePublicDashboarBaseProps) => {
  const hasWritePermissions = contextSrv.hasPermission(AccessControlAction.DashboardsPublicWrite);
  const [createPublicDashboard, { isLoading, isError }] = useCreatePublicDashboardMutation();
  const onCreate = () => {
    createPublicDashboard({ dashboard, payload: { isEnabled: true } });
    DashboardInteractions.generatePublicDashboardUrlClicked({});
  };
  const {
    handleSubmit,
    register,
    formState: { isValid },
  } = useForm<SharePublicDashboardAcknowledgmentInputs>({ mode: 'onChange' });

  const disableInputs = !hasWritePermissions || isLoading || isError || hasError;

  return (
    <div {...stylex.props(createPublicDashboardStyles.container)}>
      <div>
        <p {...stylex.props(createPublicDashboardStyles.title)}>
          <Trans i18nKey="public-dashboard.create-page.welcome-title">Welcome to public dashboards!</Trans>
        </p>
        <p {...stylex.props(createPublicDashboardStyles.description)}>
          <Trans i18nKey="public-dashboard.create-page.unsupported-features-desc">
            Currently, we don’t support template variables or frontend data sources
          </Trans>
        </p>
      </div>

      {!hasWritePermissions && <NoUpsertPermissionsAlert mode="create" />}

      {unsupportedTemplateVariables && <UnsupportedTemplateVariablesAlert />}

      {unsupportedDatasources.length > 0 && (
        <UnsupportedDataSourcesAlert unsupportedDataSources={unsupportedDatasources.join(', ')} />
      )}

      <form onSubmit={handleSubmit(onCreate)}>
        <div {...stylex.props(createPublicDashboardStyles.checkboxes)}>
          <AcknowledgeCheckboxes disabled={disableInputs} register={register} />
        </div>
        <div {...stylex.props(createPublicDashboardStyles.buttonContainer)}>
          <Button type="submit" disabled={disableInputs || !isValid} data-testid={selectors.CreateButton}>
            <Trans i18nKey="public-dashboard.create-page.generate-public-url-button">Generate public URL</Trans>
            {isLoading && <Spinner {...stylex.props(createPublicDashboardStyles.loadingSpinner)} />}
          </Button>
        </div>
      </form>
    </div>
  );
};

export function CreatePublicDashboard({ hasError }: { hasError?: boolean }) {
  const dashboardState = useSelector((store) => store.dashboard);
  const dashboard = dashboardState.getModel()!;
  const { unsupportedDataSources } = useGetUnsupportedDataSources(dashboard);
  const hasTemplateVariables = dashboardHasTemplateVariables(dashboard.getVariables());

  return (
    <CreatePublicDashboardBase
      dashboard={dashboard}
      unsupportedDatasources={unsupportedDataSources}
      unsupportedTemplateVariables={hasTemplateVariables}
      hasError={hasError}
    />
  );
}

