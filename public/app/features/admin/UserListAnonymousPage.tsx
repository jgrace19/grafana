import * as stylex from '@stylexjs/stylex';
import { useEffect } from 'react';
import { connect, type ConnectedProps } from 'react-redux';

import { selectors as e2eSelectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';
import { RadioButtonGroup, FilterInput } from '@grafana/ui';
import { bp } from '@grafana/ui/stylex/constants.stylex';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';
import { Page } from 'app/core/components/Page/Page';
import { type StoreState } from 'app/types/store';

import { AnonUsersDevicesTable } from './Users/AnonUsersTable';
import { fetchUsersAnonymousDevices, changeAnonUserSort, changeAnonPage, changeAnonQuery } from './state/actions';

const mapDispatchToProps = {
  fetchUsersAnonymousDevices,
  changeAnonUserSort,
  changeAnonPage,
  changeAnonQuery,
};

const mapStateToProps = (state: StoreState) => ({
  devices: state.userListAnonymousDevices.devices,
  query: state.userListAnonymousDevices.query,
  showPaging: state.userListAnonymousDevices.showPaging,
  totalPages: state.userListAnonymousDevices.totalPages,
  page: state.userListAnonymousDevices.page,
  filters: state.userListAnonymousDevices.filters,
});

const selectors = e2eSelectors.pages.UserListPage.UserListAdminPage;

const connector = connect(mapStateToProps, mapDispatchToProps);

interface OwnProps {}

type Props = OwnProps & ConnectedProps<typeof connector>;

const UserListAnonymousDevicesPageUnConnected = ({
  devices,
  fetchUsersAnonymousDevices,
  query,
  changeAnonQuery,
  filters,
  showPaging,
  totalPages,
  page,
  changeAnonPage,
  changeAnonUserSort,
}: Props) => {
  useEffect(() => {
    fetchUsersAnonymousDevices();
  }, [fetchUsersAnonymousDevices]);

  return (
    <Page.Contents>
      <div {...stylex.props(styles.actionBar)} data-testid={selectors.container}>
        <div {...stylex.props(styles.row)}>
          <FilterInput
            placeholder={t(
              'admin.user-list-anonymous-devices-page-un-connected.placeholder-search-devices-by-ip-address',
              'Search devices by IP address.'
            )}
            autoFocus={true}
            value={query}
            onChange={changeAnonQuery}
          />
          <RadioButtonGroup
            options={[
              {
                label: t(
                  'admin.user-list-anonymous-devices-page-un-connected.label.active-last-days',
                  'Active last 30 days'
                ),
                value: true,
              },
            ]}
            // onChange={(value) => changeFilter({ name: 'activeLast30Days', value })}
            value={filters.find((f) => f.name === 'activeLast30Days')?.value}
            className={stylex.props(styles.filter).className}
          />
        </div>
      </div>
      <AnonUsersDevicesTable
        devices={devices}
        showPaging={showPaging}
        totalPages={totalPages}
        onChangePage={changeAnonPage}
        currentPage={page}
        fetchData={changeAnonUserSort}
      />
    </Page.Contents>
  );
};

export const UserListAnonymousDevicesPageContent = connector(UserListAnonymousDevicesPageUnConnected);

export function UserListAnonymousDevicesPage() {
  return (
    <Page navId="anonymous-users">
      <UserListAnonymousDevicesPageContent />
    </Page>
  );
}

const styles = stylex.create({
  filter: {
    marginTop: 0,
    marginRight: { default: spacing['--gf-spacing-x1'], [bp.smDown]: 0 },
    marginBottom: 0,
    marginLeft: { default: spacing['--gf-spacing-x1'], [bp.smDown]: 0 },
  },

  actionBar: {
    marginBottom: spacing['--gf-spacing-x2'],
    display: 'flex',
    alignItems: 'flex-start',
    gap: spacing['--gf-spacing-x2'],

    flexWrap: {
      default: null,
      [bp.smDown]: 'wrap',
    },
  },

  row: {
    display: 'flex',
    alignItems: 'flex-start',
    textAlign: 'left',
    marginBottom: spacing['--gf-spacing-x0-5'],
    flexGrow: 1,

    flexWrap: {
      default: null,
      [bp.smDown]: 'wrap',
    },

    gap: {
      default: null,
      [bp.smDown]: spacing['--gf-spacing-x2'],
    },

    width: {
      default: null,
      [bp.smDown]: '100%',
    },
  },
});

export default UserListAnonymousDevicesPage;
