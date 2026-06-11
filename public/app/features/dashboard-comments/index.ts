export { dashboardCommentsApi, useGetCommentsQuery, useGetCommentQuery, useGetCommentCountsQuery, useCreateCommentMutation, useUpdateCommentMutation, useResolveCommentMutation, useDeleteCommentMutation } from './api/dashboardCommentsApi';
export type { CommentDTO, MentionDTO, CommentCountResult, CreateCommentRequest, UpdateCommentRequest, ResolveCommentRequest, DeleteCommentRequest, GetCommentsRequest } from './api/dashboardCommentsApi';
export { CommentThread } from './components/CommentThread';
export { CommentEditor } from './components/CommentEditor';
export { CommentsSidebar } from './components/CommentsSidebar';
export { CommentBadge } from './components/CommentBadge';
