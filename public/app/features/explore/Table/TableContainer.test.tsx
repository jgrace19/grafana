import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';

import { type DataFrame, FieldType, getDefaultTimeRange, InternalTimeZones, toDataFrame } from '@grafana/data';
import { configureStore } from 'app/store/configureStore';
import { type StoreState } from 'app/types/store';

import { TableContainer } from './TableContainer';

jest.mock('@grafana/runtime', () => ({
  ...jest.requireActual('@grafana/runtime'),
  PanelRenderer: ({ title }: { title: string }) => <div>PanelRenderer</div>,
}));

function getPanels(): HTMLElement[] {
  return screen.getAllByText(/PanelRenderer/);
}

const dataFrame = toDataFrame({
  name: 'A',
  fields: [
    {
      name: 'time',
      type: FieldType.time,
      values: [1609459200000, 1609470000000, 1609462800000, 1609466400000],
      config: {
        custom: {
          filterable: false,
        },
      },
    },
    {
      name: 'text',
      type: FieldType.string,
      values: ['test_string_1', 'test_string_2', 'test_string_3', 'test_string_4'],
      config: {
        custom: {
          filterable: false,
        },
      },
    },
  ],
});

function renderWithStore(tableResult: DataFrame[] | null = null) {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const preloadedState: Partial<StoreState> = {
    explore: {
      panes: {
        left: {
          tableResult,
          range: getDefaultTimeRange(),
          queryResponse: { series: [], state: 'Done' },
        },
      },
    } as unknown as StoreState['explore'],
  };
  const store = configureStore(preloadedState);

  return render(
    <Provider store={store}>
      <TableContainer
        exploreId="left"
        width={800}
        onCellFilterAdded={jest.fn()}
        splitOpenFn={() => {}}
        timeZone={InternalTimeZones.utc}
      />
    </Provider>
  );
}

describe('TableContainer', () => {
  describe('With one main frame', () => {
    it('should render component', () => {
      renderWithStore([dataFrame]);
      const tables = getPanels();
      expect(tables.length).toBe(1);
      expect(tables[0]).toBeInTheDocument();
    });

    it('should render 0 series returned on no items', () => {
      const emptyFrames: DataFrame[] = [
        {
          name: 'TableResultName',
          fields: [],
          length: 0,
        },
      ];
      renderWithStore(emptyFrames);
      expect(screen.getByText('0 series returned')).toBeInTheDocument();
    });

    it('should render table title with Prometheus query', () => {
      const dataFrames = [{ ...dataFrame, name: 'metric{label="value"}' }];
      renderWithStore(dataFrames);
      expect(screen.getByText('Table - metric{label="value"}')).toBeInTheDocument();
    });

    it('preserves datasource hidden fields while applying Explore column limiting', () => {
      const df = toDataFrame({
        name: 'A',
        fields: [
          {
            name: 'traceIdHidden',
            type: FieldType.string,
            values: ['t1'],
            config: {
              custom: {
                hideFrom: { viz: true },
              },
            },
          },

          {
            name: 'spanId',
            type: FieldType.string,
            values: ['s1'],
            config: {},
          },
        ],
      });

      renderWithStore([df]);
      expect(df.fields[0].config.custom?.hideFrom?.viz).toBe(true);
      expect(df.fields[1].config.custom?.hideFrom?.viz).toBe(false);
    });
  });

  describe('With multiple main frames', () => {
    it('should render multiple tables for multiple frames', () => {
      const dataFrames = [dataFrame, dataFrame];
      renderWithStore(dataFrames);
      const tables = getPanels();
      expect(tables.length).toBe(2);
      expect(tables[0]).toBeInTheDocument();
      expect(tables[1]).toBeInTheDocument();
    });
  });
});
