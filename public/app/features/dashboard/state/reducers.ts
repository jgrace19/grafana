import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { type DashboardState } from 'app/types/dashboard';

export const initialState: DashboardState = {
  getModel: () => null,
  initialDatasource: undefined,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setInitialDatasource: (state, action: PayloadAction<string | undefined>) => {
      state.initialDatasource = action.payload;
    },
  },
});

export const { setInitialDatasource } = dashboardSlice.actions;

export const dashboardReducer = dashboardSlice.reducer;

export default {
  dashboard: dashboardReducer,
};
