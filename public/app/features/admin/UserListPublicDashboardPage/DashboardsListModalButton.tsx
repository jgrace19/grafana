import * as stylex from '@stylexjs/stylex';

import { selectors as e2eSelectors } from '@grafana/e2e-selectors';
import { Trans, t } from '@grafana/i18n';
import { Button, LoadingPlaceholder, Modal, ModalsController } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { bp } from '@grafana/ui/stylex/constants.stylex';
import { colors, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';
import {
  generatePublicDashboardConfigUrl,
  generatePublicDashboardUrl,
} from 'app/features/dashboard/components/ShareModal/SharePublicDashboard/SharePublicDashboardUtils';

import { useGetActiveUserDashboardsQuery } from '../../dashboard/api/publicDashboardApi';

const selectors = e2eSelectors.pages.UserListPage.UsersListPublicDashboardsPage.DashboardsListModal;
export const DashboardsListModal = ({ email, onDismiss }: { email: string; onDismiss: () => void }) => {
  const { data: dashboards, isLoading } = useGetActiveUserDashboardsQuery(email);

  return (
    <Modal
      xstyle={styles.modal}
      isOpen
      title={t('public-dashboard-users-access-list.modal.shared-dashboard-modal-title', 'Shared dashboards')}
      onDismiss={onDismiss}
    >
      {isLoading ? (
        <div {...stylex.props(styles.loading)}>
          <LoadingPlaceholder
            text={t('public-dashboard-users-access-list.dashboard-modal.loading-text', 'Loading...')}
          />
        </div>
      ) : (
        dashboards?.map((dash) => (
          <div
            key={dash.dashboardUid}
            {...stylex.props(styles.listItem)}
            data-testid={selectors.listItem(dash.dashboardUid)}
          >
            <p {...stylex.props(styles.dashboardTitle)}>{dash.dashboardTitle}</p>
            <div {...stylex.props(styles.urlsContainer)}>
              <a
                rel="noreferrer"
                target="_blank"
                {...mergeStylexProps(stylex.props(styles.url), {
                  className: 'external-link',
                })}
                href={generatePublicDashboardUrl(dash.publicDashboardAccessToken)}
                onClick={onDismiss}
              >
                <Trans i18nKey="public-dashboard-users-access-list.dashboard-modal.external-link">External link</Trans>
              </a>
              <span {...stylex.props(styles.urlsDivider)}>{'•'}</span>
              <a
                {...mergeStylexProps(stylex.props(styles.url), {
                  className: 'external-link',
                })}
                href={generatePublicDashboardConfigUrl(dash.dashboardUid, dash.slug)}
                onClick={onDismiss}
              >
                <Trans i18nKey="public-dashboard-users-access-list.dashboard-modal.sharing-setting">
                  Sharing settings
                </Trans>
              </a>
            </div>
            <hr {...stylex.props(styles.divider)} />
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

const styles = stylex.create({
  modal: {
    width: '590px',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
  },

  listItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing['--gf-spacing-x0-5'],
  },

  divider: {
    marginTop: spacing['--gf-spacing-x1-5'],
    marginRight: 0,
    marginBottom: spacing['--gf-spacing-x1-5'],
    marginLeft: 0,
    color: colors['--gf-colors-text-secondary'],
  },

  urlsContainer: {
    display: 'flex',
    gap: spacing['--gf-spacing-x0-5'],

    flexDirection: {
      default: null,
      [bp.smDown]: 'column',
    },
  },

  urlsDivider: {
    color: colors['--gf-colors-text-secondary'],

    display: {
      default: null,
      [bp.smDown]: 'none',
    },
  },

  dashboardTitle: {
    fontSize: typography['--gf-typography-body-font-size'],
    fontWeight: typography['--gf-typography-font-weight-bold'],
    marginBottom: 0,
  },

  url: {
    fontSize: typography['--gf-typography-body-font-size'],
  },
});
