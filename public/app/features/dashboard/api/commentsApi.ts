import { createApi } from '@reduxjs/toolkit/query/react';
import { createSelector } from '@reduxjs/toolkit';

import { createBaseQuery } from '@grafana/api-clients/rtkq';
import { type RootState } from 'app/store/configureStore';

export interface DashboardCommentDTO {
  id: number;
  dashboardUid: string;
  panelId: number;
  annotationId?: string;
  parentId?: number;
  userId: number;
  content: string;
  created: number;
  updated: number;
}

export const dashboardCommentsApi = createApi({
  reducerPath: 'dashboardCommentsApi',
  baseQuery: createBaseQuery({ baseURL: '/api' }),
  tagTypes: ['DashboardComments'],
  endpoints: (builder) => ({
    listComments: builder.query<DashboardCommentDTO[], { dashboardUID: string }>({
      query: ({ dashboardUID }) => ({
        url: '/dashboard-comments',
        params: { dashboardUid: dashboardUID },
      }),
      providesTags: (_result, _error, { dashboardUID }) => [{ type: 'DashboardComments', id: dashboardUID }],
    }),
    createComment: builder.mutation<
      DashboardCommentDTO,
      {
        dashboardUid: string;
        panelId: number;
        content: string;
        parentId?: number;
        annotationId?: string;
      }
    >({
      query: (body) => ({
        url: '/dashboard-comments',
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'DashboardComments', id: arg.dashboardUid }],
    }),
    deleteComment: builder.mutation<void, { dashboardUid: string; id: number }>({
      query: ({ dashboardUid, id }) => ({
        url: `/dashboard-comments/${id}`,
        method: 'DELETE',
        params: { dashboardUid },
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'DashboardComments', id: arg.dashboardUid }],
    }),
  }),
});

export const { useListCommentsQuery, useCreateCommentMutation, useDeleteCommentMutation } = dashboardCommentsApi;

const emptyComments: DashboardCommentDTO[] = [];

export const selectCommentsByDashboardUID = (state: RootState, dashboardUID: string) =>
  dashboardCommentsApi.endpoints.listComments.select({ dashboardUID })(state);

export const selectCommentsByPanel = createSelector(
  [
    (state: RootState, dashboardUID: string) =>
      selectCommentsByDashboardUID(state, dashboardUID).data ?? emptyComments,
    (_state: RootState, _dashboardUID: string, panelId: number) => panelId,
  ],
  (comments, panelId) => comments.filter((c) => c.panelId === panelId)
);

export function selectCommentCountForPanel(state: RootState, dashboardUID: string, panelId: number): number {
  return selectCommentsByPanel(state, dashboardUID, panelId).length;
}
