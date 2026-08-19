import { type TimeZone } from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';
import { type WeekStart } from '@grafana/ui';
import { createSuccessNotification } from 'app/core/copy/appNotification';
import { notifyApp } from 'app/core/reducers/appNotification';
import { getDashboardAPI } from 'app/features/dashboard/api/dashboard_api';
import { updateTimeZoneForSession, updateWeekStartForSession } from 'app/features/profile/state/reducers';
import { type ThunkResult } from 'app/types/store';

import { loadPluginDashboards } from '../../plugins/admin/state/actions';
import { getTimeSrv } from '../services/TimeSrv';

export function importDashboard(data: any, dashboardTitle: string): ThunkResult<void> {
  return async (dispatch) => {
    await getBackendSrv().post('/api/dashboards/import', data);
    dispatch(notifyApp(createSuccessNotification('Dashboard Imported', dashboardTitle)));
    dispatch(loadPluginDashboards());
  };
}

export function removeDashboard(uid: string): ThunkResult<void> {
  return async (dispatch) => {
    const api = await getDashboardAPI();
    await api.deleteDashboard(uid, false);
    dispatch(loadPluginDashboards());
  };
}

export const updateTimeZoneDashboard =
  (timeZone: TimeZone): ThunkResult<void> =>
  (dispatch) => {
    dispatch(updateTimeZoneForSession(timeZone));
    getTimeSrv().refreshTimeModel();
  };

export const updateWeekStartDashboard =
  (weekStart?: WeekStart): ThunkResult<void> =>
  (dispatch) => {
    dispatch(updateWeekStartForSession(weekStart));
    getTimeSrv().refreshTimeModel();
  };
