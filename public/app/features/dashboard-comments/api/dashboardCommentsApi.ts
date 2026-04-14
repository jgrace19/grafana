import { createApi } from '@reduxjs/toolkit/query/react';

import { createBaseQuery } from '@grafana/api-clients/rtkq';

export interface CommentDTO {
  id: number;
  uid: string;
  dashboardUid: string;
  panelId?: number;
  annotationId?: number;
  parentId?: number;
  userId: number;
  userLogin: string;
  userName: string;
  userEmail: string;
  content: string;
  resolved: boolean;
  resolvedBy?: number;
  resolvedAt?: string;
  timeFrom?: number;
  timeTo?: number;
  created: string;
  updated: string;
  replyCount: number;
  mentions?: MentionDTO[];
  replies?: CommentDTO[];
}

export interface MentionDTO {
  id: number;
  commentId: number;
  userId: number;
  notified: boolean;
  created: string;
}

export interface CommentCountResult {
  dashboardUid: string;
  panelId?: number;
  total: number;
  unresolved: number;
}

export interface CreateCommentRequest {
  dashboardUid: string;
  panelId?: number;
  annotationId?: number;
  parentId?: number;
  content: string;
  timeFrom?: number;
  timeTo?: number;
  mentionedUserIds?: number[];
}

export interface UpdateCommentRequest {
  dashboardUid: string;
  commentId: number;
  content: string;
  mentionedUserIds?: number[];
}

export interface ResolveCommentRequest {
  dashboardUid: string;
  commentId: number;
  resolved: boolean;
}

export interface DeleteCommentRequest {
  dashboardUid: string;
  commentId: number;
}

export interface GetCommentsRequest {
  dashboardUid: string;
  panelId?: number;
  annotationId?: number;
  resolved?: boolean;
  includeReplies?: boolean;
  limit?: number;
  offset?: number;
}

export const dashboardCommentsApi = createApi({
  reducerPath: 'dashboardCommentsApi',
  baseQuery: createBaseQuery({ baseURL: '/api' }),
  tagTypes: ['DashboardComment', 'CommentCount'],
  endpoints: (builder) => ({
    getComments: builder.query<CommentDTO[], GetCommentsRequest>({
      query: (args: GetCommentsRequest) => ({
        url: `/dashboards/${args.dashboardUid}/comments`,
        params: {
          panelId: args.panelId,
          annotationId: args.annotationId,
          resolved: args.resolved,
          includeReplies: args.includeReplies,
          limit: args.limit,
          offset: args.offset,
        },
      }),
      providesTags: (
        result: CommentDTO[] | undefined,
        _error: unknown,
        args: GetCommentsRequest
      ) =>
        result
          ? [
              ...result.map((comment: CommentDTO) => ({
                type: 'DashboardComment' as const,
                id: comment.id,
              })),
              { type: 'DashboardComment' as const, id: `${args.dashboardUid}-${args.panelId ?? 'all'}` },
            ]
          : [{ type: 'DashboardComment' as const, id: `${args.dashboardUid}-${args.panelId ?? 'all'}` }],
    }),

    getComment: builder.query<CommentDTO, { dashboardUid: string; commentId: number }>({
      query: (args: { dashboardUid: string; commentId: number }) => ({
        url: `/dashboards/${args.dashboardUid}/comments/${args.commentId}`,
      }),
      providesTags: (
        _result: CommentDTO | undefined,
        _error: unknown,
        args: { dashboardUid: string; commentId: number }
      ) => [{ type: 'DashboardComment' as const, id: args.commentId }],
    }),

    getCommentCounts: builder.query<Record<number, CommentCountResult>, string>({
      query: (dashboardUid: string) => ({
        url: `/dashboards/${dashboardUid}/comments/counts`,
      }),
      providesTags: (
        _result: Record<number, CommentCountResult> | undefined,
        _error: unknown,
        dashboardUid: string
      ) => [{ type: 'CommentCount' as const, id: dashboardUid }],
    }),

    createComment: builder.mutation<CommentDTO, CreateCommentRequest>({
      query: (args: CreateCommentRequest) => {
        const { dashboardUid, ...body } = args;
        return {
          url: `/dashboards/${dashboardUid}/comments`,
          method: 'POST',
          data: body,
        };
      },
      invalidatesTags: (
        _result: CommentDTO | undefined,
        _error: unknown,
        args: CreateCommentRequest
      ) => [
        { type: 'DashboardComment' as const, id: `${args.dashboardUid}-${args.panelId ?? 'all'}` },
        { type: 'CommentCount' as const, id: args.dashboardUid },
      ],
    }),

    updateComment: builder.mutation<CommentDTO, UpdateCommentRequest>({
      query: (args: UpdateCommentRequest) => {
        const { dashboardUid, commentId, ...body } = args;
        return {
          url: `/dashboards/${dashboardUid}/comments/${commentId}`,
          method: 'PUT',
          data: body,
        };
      },
      invalidatesTags: (
        _result: CommentDTO | undefined,
        _error: unknown,
        args: UpdateCommentRequest
      ) => [{ type: 'DashboardComment' as const, id: args.commentId }],
    }),

    resolveComment: builder.mutation<CommentDTO, ResolveCommentRequest>({
      query: (args: ResolveCommentRequest) => ({
        url: `/dashboards/${args.dashboardUid}/comments/${args.commentId}/resolve`,
        method: 'POST',
        data: { resolved: args.resolved },
      }),
      invalidatesTags: (
        _result: CommentDTO | undefined,
        _error: unknown,
        args: ResolveCommentRequest
      ) => [
        { type: 'DashboardComment' as const, id: args.commentId },
        { type: 'CommentCount' as const, id: args.dashboardUid },
      ],
    }),

    deleteComment: builder.mutation<void, DeleteCommentRequest>({
      query: (args: DeleteCommentRequest) => ({
        url: `/dashboards/${args.dashboardUid}/comments/${args.commentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (
        _result: void | undefined,
        _error: unknown,
        args: DeleteCommentRequest
      ) => [
        { type: 'DashboardComment' as const, id: `${args.dashboardUid}-all` },
        { type: 'CommentCount' as const, id: args.dashboardUid },
      ],
    }),
  }),
});

export const {
  useGetCommentsQuery,
  useGetCommentQuery,
  useGetCommentCountsQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useResolveCommentMutation,
  useDeleteCommentMutation,
} = dashboardCommentsApi;
