import { render, screen } from '@testing-library/react';
import { type Props as AutoSizerProps } from 'react-virtualized-auto-sizer';
import { TestProvider } from 'test/helpers/TestProvider';

import {
  CoreApp,
  type DataSourceApi,
  EventBusSrv,
  LoadingState,
  PluginExtensionTypes,
  store,
} from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { usePluginLinks } from '@grafana/runtime';
import { configureStore } from 'app/store/configureStore';

import { ContentOutlineContextProvider } from './ContentOutline/ContentOutlineContext';
import { Explore } from './Explore';
import { QueryLibraryContextProviderMock } from './QueryLibrary/mocks';
import { initialExploreState } from './state/main';
import { createEmptyQueryResponse, makeExplorePaneState } from './state/utils';

const resizeWindow = (x: number, y: number) => {
  global.innerWidth = x;
  global.innerHeight = y;
  global.dispatchEvent(new Event('resize'));
};

const makeEmptyQueryResponse = (loadingState: LoadingState) => {
  const baseEmptyResponse = createEmptyQueryResponse();

  baseEmptyResponse.request = {
    requestId: '1',
    intervalMs: 0,
    interval: '1s',
    panelId: 1,
    range: baseEmptyResponse.timeRange,
    scopedVars: {
      apps: {
        value: 'value',
        text: 'text',
      },
    },
    targets: [
      {
        refId: 'A',
      },
    ],
    timezone: 'UTC',
    app: CoreApp.Explore,
    startTime: 0,
  };

  baseEmptyResponse.state = loadingState;

  return baseEmptyResponse;
};

jest.mock('@openfeature/react-sdk', () => ({
  useBooleanFlagValue: jest.fn().mockReturnValue(false),
}));

jest.mock('@grafana/runtime', () => ({
  ...jest.requireActual('@grafana/runtime'),
  config: {
    ...jest.requireActual('@grafana/runtime').config,
    featureToggles: {
      savedQueriesRBAC: false,
    },
  },
  getDataSourceSrv: () => ({
    get: () => Promise.resolve({}),
    getList: () => [],
    getInstanceSettings: () => {},
  }),
  usePluginLinks: jest.fn(() => ({ links: [] })),
}));

jest.mock('app/core/services/context_srv', () => ({
  contextSrv: {
    ...jest.requireActual('app/core/services/context_srv').contextSrv,
    hasPermission: () => true,
    isSignedIn: true,
    getValidIntervals: (defaultIntervals: string[]) => defaultIntervals,
  },
}));

// for the AutoSizer component to have a width
jest.mock('react-virtualized-auto-sizer', () => {
  return ({ children }: AutoSizerProps) =>
    children({
      height: 1,
      scaledHeight: 1,
      scaledWidth: 1,
      width: 1,
    });
});

const usePluginLinksMock = jest.mocked(usePluginLinks);

interface SetupOptions {
  paneOverrides?: Partial<ReturnType<typeof makeExplorePaneState>>;
  queryResponse?: ReturnType<typeof makeEmptyQueryResponse>;
  queryLibraryRef?: string;
  datasourceInstance?: DataSourceApi | null;
}

const setup = (options: SetupOptions = {}) => {
  const { paneOverrides, queryResponse, queryLibraryRef, datasourceInstance } = options;

  const defaultDatasource = {
    meta: {
      metrics: true,
      logs: true,
    },
    components: {
      QueryEditorHelp: {},
    },
  } as DataSourceApi;

  const paneState = makeExplorePaneState();
  const mergedPane = {
    ...paneState,
    ...paneOverrides,
    queryResponse: queryResponse ?? paneState.queryResponse,
    datasourceInstance: datasourceInstance !== undefined ? datasourceInstance : defaultDatasource,
    queryLibraryRef: queryLibraryRef,
  };

  const explorerStore = configureStore({
    explore: {
      ...initialExploreState,
      panes: {
        left: mergedPane,
      },
    },
  });

  return render(
    <TestProvider store={explorerStore}>
      <ContentOutlineContextProvider>
        <Explore
          exploreId="left"
          eventBus={new EventBusSrv()}
          showQueryInspector={false}
          setShowQueryInspector={() => {}}
        />
      </ContentOutlineContextProvider>
    </TestProvider>
  );
};

describe('Explore', () => {
  it('should not render no data with not started loading state', async () => {
    setup();

    // Wait for the Explore component to render
    await screen.findByTestId(selectors.components.DataSourcePicker.container);

    expect(screen.queryByTestId('explore-no-data')).not.toBeInTheDocument();
  });

  it('should render no data with done loading state', async () => {
    setup({ queryResponse: makeEmptyQueryResponse(LoadingState.Done) });

    // Wait for the Explore component to render
    await screen.findByTestId(selectors.components.DataSourcePicker.container);

    expect(screen.getByTestId('explore-no-data')).toBeInTheDocument();
  });

  it('should render toolbar extension point if extensions is available', async () => {
    usePluginLinksMock.mockReturnValue({
      links: [
        {
          id: '1',
          pluginId: 'grafana',
          title: 'Test 1',
          description: '',
          type: PluginExtensionTypes.link,
          onClick: () => {},
        },
        {
          id: '2',
          pluginId: 'grafana',
          title: 'Test 2',
          description: '',
          type: PluginExtensionTypes.link,
          onClick: () => {},
        },
      ],
      isLoading: false,
    });

    setup({ queryResponse: makeEmptyQueryResponse(LoadingState.Done) });
    // Wait for the Explore component to render
    await screen.findByTestId(selectors.components.DataSourcePicker.container);

    expect(screen.getByRole('button', { name: 'Add' })).toBeVisible();
  });

  describe('On small screens', () => {
    const windowWidth = global.innerWidth,
      windowHeight = global.innerHeight;

    beforeAll(() => {
      resizeWindow(500, 500);
    });

    afterAll(() => {
      resizeWindow(windowWidth, windowHeight);
    });

    it('should render data source picker', async () => {
      setup();

      const dataSourcePicker = await screen.findByTestId(selectors.components.DataSourcePicker.container);

      expect(dataSourcePicker).toBeInTheDocument();
    });
  });

  describe('Content Outline', () => {
    it('should retrieve the last visible state from local storage', async () => {
      const getBoolMock = jest.spyOn(store, 'getBool').mockReturnValue(false);
      setup();
      const showContentOutlineButton = screen.queryByRole('button', { name: 'Collapse outline' });
      expect(showContentOutlineButton).not.toBeInTheDocument();
      getBoolMock.mockRestore();
    });
  });

  describe('Saved Queries Integration', () => {
    it('should enable add query buttons when queryLibraryRef is undefined', async () => {
      setup({ queryLibraryRef: undefined });

      // Wait for the Explore component to render
      await screen.findByTestId(selectors.components.DataSourcePicker.container);

      const addQueryButton = screen.getByRole('button', { name: /Add query$/i });
      expect(addQueryButton).toBeEnabled();
    });

    it('should disable add query buttons when queryLibraryRef is set (editing from library)', async () => {
      setup({ queryLibraryRef: 'library-query-123' });

      // Wait for the Explore component to render
      await screen.findByTestId(selectors.components.DataSourcePicker.container);

      const addQueryButton = screen.getByRole('button', { name: /Add query$/i });
      expect(addQueryButton).toBeDisabled();
    });

    it('should disable both add query and add from library buttons when editing from library', async () => {
      const defaultDatasource = {
        meta: {
          metrics: true,
          logs: true,
        },
        components: {
          QueryEditorHelp: {},
        },
      } as DataSourceApi;

      const paneState = makeExplorePaneState();
      const explorerStore = configureStore({
        explore: {
          ...initialExploreState,
          panes: {
            left: {
              ...paneState,
              datasourceInstance: defaultDatasource,
              queryLibraryRef: 'library-query-123',
            },
          },
        },
      });

      render(
        <TestProvider store={explorerStore}>
          <QueryLibraryContextProviderMock queryLibraryEnabled={true}>
            <ContentOutlineContextProvider>
              <Explore
                exploreId="left"
                eventBus={new EventBusSrv()}
                showQueryInspector={false}
                setShowQueryInspector={() => {}}
              />
            </ContentOutlineContextProvider>
          </QueryLibraryContextProviderMock>
        </TestProvider>
      );

      // Wait for the Explore component to render
      await screen.findByTestId(selectors.components.DataSourcePicker.container);

      const addQueryButton = screen.getByRole('button', { name: /Add query$/i });
      const addFromLibraryButton = screen.getByRole('button', { name: /Add from saved queries/i });

      expect(addQueryButton).toBeDisabled();
      expect(addFromLibraryButton).toBeDisabled();
    });
  });
});
