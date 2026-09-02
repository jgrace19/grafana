import { setInitialDatasource, dashboardReducer, initialState } from './reducers';

describe('dashboard reducer', () => {
  it('should set initial datasource', () => {
    const state = dashboardReducer(initialState, setInitialDatasource('prometheus-uid'));
    expect(state.initialDatasource).toBe('prometheus-uid');
  });

  it('should clear initial datasource', () => {
    const withDs = dashboardReducer(initialState, setInitialDatasource('prometheus-uid'));
    const state = dashboardReducer(withDs, setInitialDatasource(undefined));
    expect(state.initialDatasource).toBeUndefined();
  });
});
