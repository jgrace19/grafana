package dashboardcomments

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/grafana/grafana/pkg/api/response"
	"github.com/grafana/grafana/pkg/api/routing"
	"github.com/grafana/grafana/pkg/middleware"
	contextmodel "github.com/grafana/grafana/pkg/services/contexthandler/model"
	"github.com/grafana/grafana/pkg/services/dashboards"
	"github.com/grafana/grafana/pkg/services/featuremgmt"
	"github.com/grafana/grafana/pkg/web"
)

func (s *DashboardCommentsService) registerAPIEndpoints() {
	s.RouteRegister.Group("/api/dashboard-comments", func(entities routing.RouteRegister) {
		entities.Post("/", middleware.ReqSignedIn, routing.Wrap(s.createHandler))
		entities.Get("/", middleware.ReqSignedIn, routing.Wrap(s.listHandler))
		entities.Delete("/:id", middleware.ReqSignedIn, routing.Wrap(s.deleteHandler))
	})
}

type createCommentHTTPBody struct {
	DashboardUID string  `json:"dashboardUid"`
	PanelID      int64   `json:"panelId"`
	Content      string  `json:"content"`
	ParentID     *int64  `json:"parentId"`
	AnnotationID *string `json:"annotationId"`
}

func (s *DashboardCommentsService) featureEnabled(c *contextmodel.ReqContext) bool {
	return s.features.IsEnabled(c.Req.Context(), featuremgmt.FlagDashboardComments)
}

func (s *DashboardCommentsService) ensureDashboardAccess(c *contextmodel.ReqContext, dashboardUID string) error {
	_, err := s.dashboardService.GetDashboard(c.Req.Context(), &dashboards.GetDashboardQuery{
		UID:   dashboardUID,
		OrgID: c.OrgID,
	})
	if err != nil {
		return err
	}
	return nil
}

func (s *DashboardCommentsService) createHandler(c *contextmodel.ReqContext) response.Response {
	if !s.featureEnabled(c) {
		return response.Error(http.StatusNotFound, "Not found", nil)
	}

	body := createCommentHTTPBody{}
	if err := web.Bind(c.Req, &body); err != nil {
		return response.Error(http.StatusBadRequest, "bad request data", err)
	}

	if err := s.ensureDashboardAccess(c, body.DashboardUID); err != nil {
		return response.Error(http.StatusForbidden, "dashboard not found or access denied", err)
	}

	dto, err := s.CreateComment(c.Req.Context(), c.SignedInUser, CreateCommentCmd{
		DashboardUID: body.DashboardUID,
		PanelID:      body.PanelID,
		Content:      body.Content,
		ParentID:     body.ParentID,
		AnnotationID: body.AnnotationID,
	})
	if err != nil {
		switch {
		case errors.Is(err, ErrInvalidInput):
			return response.Error(http.StatusBadRequest, err.Error(), err)
		case errors.Is(err, ErrInvalidParentDepth):
			return response.Error(http.StatusBadRequest, err.Error(), err)
		case errors.Is(err, ErrNotFound):
			return response.Error(http.StatusNotFound, err.Error(), err)
		default:
			return response.Error(http.StatusInternalServerError, "Failed to create comment", err)
		}
	}

	return response.JSON(http.StatusOK, dto)
}

func (s *DashboardCommentsService) listHandler(c *contextmodel.ReqContext) response.Response {
	if !s.featureEnabled(c) {
		return response.Error(http.StatusNotFound, "Not found", nil)
	}

	dashboardUID := c.Query("dashboardUid")
	if err := s.ensureDashboardAccess(c, dashboardUID); err != nil {
		return response.Error(http.StatusForbidden, "dashboard not found or access denied", err)
	}

	comments, err := s.ListComments(c.Req.Context(), c.SignedInUser, ListCommentsQuery{DashboardUID: dashboardUID})
	if err != nil {
		if errors.Is(err, ErrInvalidInput) {
			return response.Error(http.StatusBadRequest, err.Error(), err)
		}
		return response.Error(http.StatusInternalServerError, "Failed to list comments", err)
	}

	return response.JSON(http.StatusOK, comments)
}

func (s *DashboardCommentsService) deleteHandler(c *contextmodel.ReqContext) response.Response {
	if !s.featureEnabled(c) {
		return response.Error(http.StatusNotFound, "Not found", nil)
	}

	idStr := web.Params(c.Req)[":id"]
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil || id <= 0 {
		return response.Error(http.StatusBadRequest, "invalid id", err)
	}

	dashboardUID := c.Query("dashboardUid")
	if err := s.ensureDashboardAccess(c, dashboardUID); err != nil {
		return response.Error(http.StatusForbidden, "dashboard not found or access denied", err)
	}

	if err := s.DeleteComment(c.Req.Context(), c.SignedInUser, id, dashboardUID); err != nil {
		switch {
		case errors.Is(err, ErrNotFound):
			return response.Error(http.StatusNotFound, err.Error(), err)
		case errors.Is(err, ErrForbidden):
			return response.Error(http.StatusForbidden, err.Error(), err)
		default:
			return response.Error(http.StatusInternalServerError, "Failed to delete comment", err)
		}
	}

	return response.JSON(http.StatusOK, map[string]string{"message": "deleted"})
}
