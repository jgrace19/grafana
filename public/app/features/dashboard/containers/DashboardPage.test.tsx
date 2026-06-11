import { screen, waitFor } from '@testing-library/react';
import { KBarProvider } from 'kbar';
import { useEffectOnce } from 'react-use';
import { render } from 'test/test-utils';

import { selectors } from '@grafana/e2e-selectors';
import { config, setDataSourceSrv } from '@grafana/runtime';
import { type Dashboard } from '@grafana/schema';
import { AppChrome } from 'app/core/components/AppChrome/AppChrome';
import { getRouteComponentProps } from 'app/core/navigation/mocks/routeProps';
import { type RouteDescriptor } from 'app/core/navigation/types';
import { HOME_NAV_ID } from 'app/core/reducers/navModel';
import { configureStore } from 'app/store/configureStore';
import { DashboardInitPhase, type DashboardMeta, DashboardRoutes } from 'app/types/dashboard';

import { type Props as LazyLoaderProps } from '../dashgrid/LazyLoader';
import { type DashboardSrv, setDashboardSrv } from '../services/DashboardSrv';
import { type DashboardModel } from '../state/DashboardModel';
import { createDashboardModelFixture } from '../state/__fixtures__/dashboardFixtures';

import { type Props, UnthemedDashboardPage } from './DashboardPage';

jest.mock('app/features/dashboard/state/initDashboard', () => ({
  initDashboard: jest.fn(() => ({ type: 'dashboard/initDashboard' })),
}));

jest.mock('app/features/dashboard/state/actions', () => ({
  cleanUpDashboardAndVariables: jest.fn(() => ({ type: 'dashboard/cleanUpDashboardAndVariables' })),
}));

jest.mock('app/features/dashboard/dashgrid/LazyLoader', () => {
  const LazyLoader = ({ children, onLoad }: Pick<LazyLoaderProps, 'children' | 'onLoad'>) => {
    useEffectOnce(() => {
      onLoad?.();
    });
    return <>{typeof children === 'function' ? children({ isInView: true }) : children}</>;
  };
  return { LazyLoader };
});

jest.mock('app/features/dashboard/components/DashboardSettings/GeneralSettings', () => {
  const GeneralSettings = () => {
    return <>general settings</>;
  };

  return { GeneralSettings };
});

jest.mock('app/features/query/components/QueryGroup', () => {
  return {
    QueryGroup: () => null,
  };
});

jest.mock('app/core/app_events', () => ({
  appEvents: {
    subscribe: () => {
      return { unsubscribe: () => {} };
    },
  },
}));

jest.mock('@grafana/runtime', () => ({
  ...jest.requireActual('@grafana/runtime'),
  getPluginLinkExtensions: jest.fn().mockReturnValue({ extensions: [] }),
  usePluginLinks: jest.fn().mockReturnValue({ links: [] }),
}));

function getTestDashboard(overrides?: Partial<Dashboard>, metaOverrides?: Partial<DashboardMeta>): DashboardModel {
  const data = Object.assign(
    {
      title: 'My dashboard',
      panels: [
        {
          id: 1,
          type: 'timeseries',
          title: 'My panel title',
          gridPos: { x: 0, y: 0, w: 1, h: 1 },
        },
      ],
    },
    overrides
  );

  return createDashboardModelFixture(data, metaOverrides);
}

const { initDashboard: mockInitDashboard } = jest.requireMock('app/features/dashboard/state/initDashboard');
const { cleanUpDashboardAndVariables: mockCleanUpDashboardAndVariables } = jest.requireMock(
  'app/features/dashboard/state/actions'
);

function getBaseNavIndex() {
  return {
    'dashboards/browse': {
      text: 'Dashboards',
      id: 'dashboards/browse',
      parentItem: { text: 'Home', id: HOME_NAV_ID, url: '/' },
    },
    [HOME_NAV_ID]: { text: 'Home', id: HOME_NAV_ID, url: '/' },
  };
}

function getBaseProps(): Props {
  return {
    ...getRouteComponentProps({
      route: { routeName: DashboardRoutes.Normal } as RouteDescriptor,
    }),
    params: { slug: 'my-dash', uid: '11' },
  };
}

function setup(propOverrides?: Partial<Props>, dashboardModel?: DashboardModel | null) {
  config.bootData.navTree = [
    { text: 'Dashboards', id: 'dashboards/browse' },
    { text: 'Home', id: HOME_NAV_ID, url: '/' },
    {
      text: 'Help',
      id: 'help',
    },
  ];

  const store = configureStore({
    dashboard: {
      initPhase: DashboardInitPhase.NotStarted,
      initError: null,
      getModel: () => dashboardModel ?? null,
      initialDatasource: undefined,
    },
    navIndex: getBaseNavIndex(),
  });

  const props: Props = {
    ...getBaseProps(),
    ...propOverrides,
  };

  const { unmount, rerender } = render(<UnthemedDashboardPage {...props} />, { store });

  const wrappedRerender = (newProps: Partial<Props>, newDashboard?: DashboardModel | null) => {
    // Update store state for dashboard changes
    if (newDashboard !== undefined) {
      store.dispatch({
        type: 'dashboard/dashboardInitCompleted',
        payload: newDashboard,
      });
    }
    Object.assign(props, newProps);
    return rerender(<UnthemedDashboardPage {...props} />);
  };

  return { rerender: wrappedRerender, unmount, store };
}

describe('DashboardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should call initDashboard on mount', () => {
    setup();
    expect(mockInitDashboard).toHaveBeenCalledWith(
      expect.objectContaining({
        fixUrl: true,
        routeName: 'normal-dashboard',
        urlSlug: 'my-dash',
        urlUid: '11',
      })
    );
  });

  describe('Given a simple dashboard', () => {
    it('Should render panels', async () => {
      setup({}, getTestDashboard());
      expect(await screen.findByText('My panel title')).toBeInTheDocument();
    });

    it('Should update title', async () => {
      setup({}, getTestDashboard());
      await waitFor(() => {
        expect(document.title).toBe('My dashboard - Dashboards - Grafana');
      });
    });

    it('only calls initDashboard once when wrapped in AppChrome', async () => {
      const store = configureStore({
        dashboard: {
          initPhase: DashboardInitPhase.Completed,
          initError: null,
          getModel: () => getTestDashboard(),
          initialDatasource: undefined,
        },
        navIndex: getBaseNavIndex(),
      });

      const props: Props = {
        ...getBaseProps(),
      };

      render(
        <KBarProvider>
          <AppChrome>
            <UnthemedDashboardPage {...props} />
          </AppChrome>
        </KBarProvider>,
        { store }
      );

      await screen.findByText('My dashboard');
      expect(mockInitDashboard).toHaveBeenCalledTimes(1);
    });
  });

  describe('When going into view mode', () => {
    beforeEach(() => {
      setDataSourceSrv({
        registerRuntimeDataSource: jest.fn(),
        get: jest.fn().mockResolvedValue({ getRef: jest.fn(), query: jest.fn().mockResolvedValue([]) }),
        getInstanceSettings: jest.fn().mockReturnValue({ meta: {} }),
        getList: jest.fn(),
        reload: jest.fn(),
      });
      setDashboardSrv({
        getCurrent: () => getTestDashboard(),
      } as DashboardSrv);
    });

    it('Should render panel in view mode', async () => {
      const dashboard = getTestDashboard();
      setup(
        {
          queryParams: { viewPanel: '1' },
        },
        dashboard
      );
      await waitFor(() => {
        expect(dashboard.panelInView).toBeDefined();
        expect(dashboard.panels[0].isViewing).toBe(true);
      });
    });

    it('Should reset state when leaving', async () => {
      const dashboard = getTestDashboard();
      const { rerender } = setup(
        {
          queryParams: { viewPanel: '1' },
        },
        dashboard
      );
      rerender({ queryParams: {} }, dashboard);

      await waitFor(() => {
        expect(dashboard.panelInView).toBeUndefined();
        expect(dashboard.panels[0].isViewing).toBe(false);
      });
    });
  });

  describe('When going into edit mode', () => {
    it('Should render panel in edit mode', async () => {
      const dashboard = getTestDashboard();
      setup(
        {
          queryParams: { editPanel: '1' },
        },
        dashboard
      );
      await waitFor(() => {
        expect(dashboard.panelInEdit).toBeDefined();
      });
    });
  });

  describe('When dashboard unmounts', () => {
    it('Should call clean up action', async () => {
      const { unmount } = setup();
      unmount();
      await waitFor(() => {
        expect(mockCleanUpDashboardAndVariables).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('When dashboard changes', () => {
    it('Should call init on uid change', async () => {
      const { rerender } = setup({}, getTestDashboard());
      rerender({ params: { uid: 'new-uid' } }, getTestDashboard({ title: 'Another dashboard' }));
      await waitFor(() => {
        expect(mockInitDashboard).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('No kiosk mode tv', () => {
    it('should render dashboard page toolbar with no submenu', async () => {
      setup({}, getTestDashboard());
      expect(await screen.findAllByTestId(selectors.pages.Dashboard.DashNav.navV2)).toHaveLength(1);
      expect(screen.queryAllByTestId(selectors.pages.Dashboard.SubMenu.submenu)).toHaveLength(0);
    });
  });

  describe('When in full kiosk mode', () => {
    it('should not render page toolbar and submenu', async () => {
      setup({ queryParams: { kiosk: true } }, getTestDashboard());
      await waitFor(() => {
        expect(screen.queryAllByTestId(selectors.pages.Dashboard.DashNav.navV2)).toHaveLength(0);
        expect(screen.queryAllByTestId(selectors.pages.Dashboard.SubMenu.submenu)).toHaveLength(0);
      });
    });
  });
});
