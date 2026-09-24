import clsx from 'clsx';

import { selectors as e2eSelectors } from '@grafana/e2e-selectors';
import { Trans, t } from '@grafana/i18n';
import { Button, LoadingPlaceholder, Modal, ModalsController, } from '@grafana/ui';
import {
  generatePublicDashboardConfigUrl,
  generatePublicDashboardUrl,
} from 'app/features/dashboard/components/ShareModal/SharePublicDashboard/SharePublicDashboardUtils';

import { useGetActiveUserDashboardsQuery } from '../../dashboard/api/publicDashboardApi';

const selectors = e2eSelectors.pages.UserListPage.UsersListPublicDashboardsPage.DashboardsListModal;
export const DashboardsListModal = ({ email, onDismiss }: { email: string; onDismiss: () => void }) => {
  const styles = (getStyles);

  const { data: dashboards, isLoading } = useGetActiveUserDashboardsQuery(email);

  return (
    <Modal
      {...stylex.props(dashboardsListModalButtonStyles.modal)}
      isOpen
      title={t('public-dashboard-users-access-list.modal.shared-dashboard-modal-title', 'Shared dashboards')}
      onDismiss={onDismiss}
    >
      {isLoading ? (
        <div {...stylex.props(dashboardsListModalButtonStyles.loading)}>
          <LoadingPlaceholder
            text={t('public-dashboard-users-access-list.dashboard-modal.loading-text', 'Loading...')}
          />
        </div>
      ) : (
        dashboards?.map((dash) => (
          <div key={dash.dashboardUid} {...stylex.props(dashboardsListModalButtonStyles.listItem)} data-testid={selectors.listItem(dash.dashboardUid)}>
            <p {...stylex.props(dashboardsListModalButtonStyles.dashboardTitle)}>{dash.dashboardTitle}</p>
            <div {...stylex.props(dashboardsListModalButtonStyles.urlsContainer)}>
              <a
                rel="noreferrer"
                target="_blank"
                {...mergeStylexClassName(stylex.props(dashboardsListModalButtonStyles.url, 'external-link', ), undefined)}
                href={generatePublicDashboardUrl(dash.publicDashboardAccessToken)}
                onClick={onDismiss}
              >
                <Trans i18nKey="public-dashboard-users-access-list.dashboard-modal.external-link">External link</Trans>
              </a>
              <span {...stylex.props(dashboardsListModalButtonStyles.urlsDivider)}>{'•'}</span>
              <a
                {...mergeStylexClassName(stylex.props(dashboardsListModalButtonStyles.url, 'external-link', ), undefined)}
                href={generatePublicDashboardConfigUrl(dash.dashboardUid, dash.slug)}
                onClick={onDismiss}
              >
                <Trans i18nKey="public-dashboard-users-access-list.dashboard-modal.sharing-setting">
                  Sharing settings
                </Trans>
              </a>
            </div>
            <hr {...stylex.props(dashboardsListModalButtonStyles.divider)} />
          </div>
        ))
      )}
    </Modal>
  );
};

export const DashboardsListModalButton = ({ email }: { email: string }) => {
  const translatedDashboardListModalButtonText = t(
    'public-dashboard-users-access-list.dashboard-modal.open-dashboard-list-text',
    'Open dashboards list'
  );
  return (
    <ModalsController>
      {({ showModal, hideModal }) => (
        <Button
          variant="secondary"
          size="sm"
          icon="question-circle"
          title={translatedDashboardListModalButtonText}
          aria-label={translatedDashboardListModalButtonText}
          onClick={() => showModal(DashboardsListModal, { email, onDismiss: hideModal })}
        />
      )}
    </ModalsController>
  );
};

