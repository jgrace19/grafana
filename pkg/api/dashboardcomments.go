package api

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/grafana/grafana/pkg/api/dtos"
	"github.com/grafana/grafana/pkg/api/response"
	"github.com/grafana/grafana/pkg/apimachinery/identity"
	"github.com/grafana/grafana/pkg/services/dashboardcomments"
	contextmodel "github.com/grafana/grafana/pkg/services/contexthandler/model"
	"github.com/grafana/grafana/pkg/web"
)

const defaultCommentsLimit = 50

// swagger:route GET /dashboards/{dashboardUid}/comments dashboard_comments getDashboardComments
//
// Get comments for a dashboard.
//
// Returns all comments for the specified dashboard.
//
// Responses:
// 200: getDashboardCommentsResponse
// 401: unauthorisedError
// 403: forbiddenError
// 500: internalServerError
func (hs *HTTPServer) GetDashboardComments(c *contextmodel.ReqContext) response.Response {
	dashboardUID := web.Params(c.Req)[":dashboardUid"]

	panelID := c.QueryInt64("panelId")
	var panelIDPtr *int64
	if panelID > 0 {
		panelIDPtr = &panelID
	}

	annotationID := c.QueryInt64("annotationId")
	var annotationIDPtr *int64
	if annotationID > 0 {
		annotationIDPtr = &annotationID
	}

	var resolvedPtr *bool
	resolvedStr := c.Query("resolved")
	if resolvedStr != "" {
		resolved := resolvedStr == "true"
		resolvedPtr = &resolved
	}

	limit := c.QueryInt64("limit")
	if limit == 0 {
		limit = defaultCommentsLimit
	}

	query := &dashboardcomments.GetCommentsQuery{
		OrgID:          c.GetOrgID(),
		DashboardUID:   dashboardUID,
		PanelID:        panelIDPtr,
		AnnotationID:   annotationIDPtr,
		Resolved:       resolvedPtr,
		Limit:          limit,
		Offset:         c.QueryInt64("offset"),
		IncludeReplies: c.QueryBool("includeReplies"),
	}

	comments, err := hs.dashboardCommentsService.List(c.Req.Context(), query)
	if err != nil {
		return response.Error(http.StatusInternalServerError, "Failed to get comments", err)
	}

	return response.JSON(http.StatusOK, comments)
}

// swagger:route GET /dashboards/{dashboardUid}/comments/{commentId} dashboard_comments getDashboardComment
//
// Get a specific comment.
//
// Returns a specific comment by ID.
//
// Responses:
// 200: getDashboardCommentResponse
// 401: unauthorisedError
// 403: forbiddenError
// 404: notFoundError
// 500: internalServerError
func (hs *HTTPServer) GetDashboardComment(c *contextmodel.ReqContext) response.Response {
	commentIDStr := web.Params(c.Req)[":commentId"]
	commentID, err := strconv.ParseInt(commentIDStr, 10, 64)
	if err != nil {
		return response.Error(http.StatusBadRequest, "Invalid comment ID", err)
	}

	query := &dashboardcomments.GetCommentByIDQuery{
		ID:    commentID,
		OrgID: c.GetOrgID(),
	}

	comment, err := hs.dashboardCommentsService.Get(c.Req.Context(), query)
	if err != nil {
		if errors.Is(err, dashboardcomments.ErrCommentNotFound) {
			return response.Error(http.StatusNotFound, "Comment not found", err)
		}
		return response.Error(http.StatusInternalServerError, "Failed to get comment", err)
	}

	return response.JSON(http.StatusOK, comment)
}

// swagger:route POST /dashboards/{dashboardUid}/comments dashboard_comments createDashboardComment
//
// Create a comment on a dashboard.
//
// Creates a new comment on the specified dashboard.
//
// Responses:
// 200: createDashboardCommentResponse
// 400: badRequestError
// 401: unauthorisedError
// 403: forbiddenError
// 500: internalServerError
func (hs *HTTPServer) CreateDashboardComment(c *contextmodel.ReqContext) response.Response {
	dashboardUID := web.Params(c.Req)[":dashboardUid"]

	cmd := dtos.CreateDashboardCommentCmd{}
	if err := web.Bind(c.Req, &cmd); err != nil {
		return response.Error(http.StatusBadRequest, "bad request data", err)
	}

	userID, _ := identity.UserIdentifier(c.GetID())

	createCmd := &dashboardcomments.CreateCommentCommand{
		OrgID:            c.GetOrgID(),
		DashboardUID:     dashboardUID,
		PanelID:          cmd.PanelID,
		AnnotationID:     cmd.AnnotationID,
		ParentID:         cmd.ParentID,
		UserID:           userID,
		Content:          cmd.Content,
		TimeFrom:         cmd.TimeFrom,
		TimeTo:           cmd.TimeTo,
		MentionedUserIDs: cmd.MentionedUserIDs,
	}

	comment, err := hs.dashboardCommentsService.Create(c.Req.Context(), createCmd)
	if err != nil {
		if errors.Is(err, dashboardcomments.ErrCommentContentEmpty) {
			return response.Error(http.StatusBadRequest, "Comment content cannot be empty", err)
		}
		if errors.Is(err, dashboardcomments.ErrInvalidParent) {
			return response.Error(http.StatusBadRequest, "Invalid parent comment", err)
		}
		if errors.Is(err, dashboardcomments.ErrCannotReplyToReply) {
			return response.Error(http.StatusBadRequest, "Cannot reply to a reply", err)
		}
		return response.Error(http.StatusInternalServerError, "Failed to create comment", err)
	}

	return response.JSON(http.StatusOK, comment)
}

// swagger:route PUT /dashboards/{dashboardUid}/comments/{commentId} dashboard_comments updateDashboardComment
//
// Update a comment.
//
// Updates an existing comment.
//
// Responses:
// 200: updateDashboardCommentResponse
// 400: badRequestError
// 401: unauthorisedError
// 403: forbiddenError
// 404: notFoundError
// 500: internalServerError
func (hs *HTTPServer) UpdateDashboardComment(c *contextmodel.ReqContext) response.Response {
	commentIDStr := web.Params(c.Req)[":commentId"]
	commentID, err := strconv.ParseInt(commentIDStr, 10, 64)
	if err != nil {
		return response.Error(http.StatusBadRequest, "Invalid comment ID", err)
	}

	cmd := dtos.UpdateDashboardCommentCmd{}
	if err := web.Bind(c.Req, &cmd); err != nil {
		return response.Error(http.StatusBadRequest, "bad request data", err)
	}

	userID, _ := identity.UserIdentifier(c.GetID())

	updateCmd := &dashboardcomments.UpdateCommentCommand{
		ID:               commentID,
		OrgID:            c.GetOrgID(),
		UserID:           userID,
		Content:          cmd.Content,
		MentionedUserIDs: cmd.MentionedUserIDs,
	}

	comment, err := hs.dashboardCommentsService.Update(c.Req.Context(), updateCmd)
	if err != nil {
		if errors.Is(err, dashboardcomments.ErrCommentNotFound) {
			return response.Error(http.StatusNotFound, "Comment not found", err)
		}
		if errors.Is(err, dashboardcomments.ErrUnauthorized) {
			return response.Error(http.StatusForbidden, "Not authorized to update this comment", err)
		}
		if errors.Is(err, dashboardcomments.ErrCommentContentEmpty) {
			return response.Error(http.StatusBadRequest, "Comment content cannot be empty", err)
		}
		return response.Error(http.StatusInternalServerError, "Failed to update comment", err)
	}

	return response.JSON(http.StatusOK, comment)
}

// swagger:route DELETE /dashboards/{dashboardUid}/comments/{commentId} dashboard_comments deleteDashboardComment
//
// Delete a comment.
//
// Deletes a comment.
//
// Responses:
// 200: okResponse
// 401: unauthorisedError
// 403: forbiddenError
// 404: notFoundError
// 500: internalServerError
func (hs *HTTPServer) DeleteDashboardComment(c *contextmodel.ReqContext) response.Response {
	commentIDStr := web.Params(c.Req)[":commentId"]
	commentID, err := strconv.ParseInt(commentIDStr, 10, 64)
	if err != nil {
		return response.Error(http.StatusBadRequest, "Invalid comment ID", err)
	}

	userID, _ := identity.UserIdentifier(c.GetID())

	deleteCmd := &dashboardcomments.DeleteCommentCommand{
		ID:     commentID,
		OrgID:  c.GetOrgID(),
		UserID: userID,
	}

	err = hs.dashboardCommentsService.Delete(c.Req.Context(), deleteCmd)
	if err != nil {
		if errors.Is(err, dashboardcomments.ErrCommentNotFound) {
			return response.Error(http.StatusNotFound, "Comment not found", err)
		}
		if errors.Is(err, dashboardcomments.ErrUnauthorized) {
			return response.Error(http.StatusForbidden, "Not authorized to delete this comment", err)
		}
		return response.Error(http.StatusInternalServerError, "Failed to delete comment", err)
	}

	return response.Success("Comment deleted")
}

// swagger:route POST /dashboards/{dashboardUid}/comments/{commentId}/resolve dashboard_comments resolveDashboardComment
//
// Resolve or unresolve a comment.
//
// Marks a comment as resolved or unresolved.
//
// Responses:
// 200: resolveDashboardCommentResponse
// 400: badRequestError
// 401: unauthorisedError
// 403: forbiddenError
// 404: notFoundError
// 500: internalServerError
func (hs *HTTPServer) ResolveDashboardComment(c *contextmodel.ReqContext) response.Response {
	commentIDStr := web.Params(c.Req)[":commentId"]
	commentID, err := strconv.ParseInt(commentIDStr, 10, 64)
	if err != nil {
		return response.Error(http.StatusBadRequest, "Invalid comment ID", err)
	}

	cmd := dtos.ResolveDashboardCommentCmd{}
	if err := web.Bind(c.Req, &cmd); err != nil {
		return response.Error(http.StatusBadRequest, "bad request data", err)
	}

	userID, _ := identity.UserIdentifier(c.GetID())

	resolveCmd := &dashboardcomments.ResolveCommentCommand{
		ID:         commentID,
		OrgID:      c.GetOrgID(),
		ResolvedBy: userID,
		Resolved:   cmd.Resolved,
	}

	comment, err := hs.dashboardCommentsService.Resolve(c.Req.Context(), resolveCmd)
	if err != nil {
		if errors.Is(err, dashboardcomments.ErrCommentNotFound) {
			return response.Error(http.StatusNotFound, "Comment not found", err)
		}
		return response.Error(http.StatusInternalServerError, "Failed to resolve comment", err)
	}

	return response.JSON(http.StatusOK, comment)
}

// swagger:route GET /dashboards/{dashboardUid}/comments/counts dashboard_comments getDashboardCommentCounts
//
// Get comment counts for panels.
//
// Returns comment counts for all panels in a dashboard.
//
// Responses:
// 200: getDashboardCommentCountsResponse
// 401: unauthorisedError
// 403: forbiddenError
// 500: internalServerError
func (hs *HTTPServer) GetDashboardCommentCounts(c *contextmodel.ReqContext) response.Response {
	dashboardUID := web.Params(c.Req)[":dashboardUid"]

	counts, err := hs.dashboardCommentsService.GetPanelCounts(c.Req.Context(), c.GetOrgID(), dashboardUID)
	if err != nil {
		return response.Error(http.StatusInternalServerError, "Failed to get comment counts", err)
	}

	return response.JSON(http.StatusOK, counts)
}
