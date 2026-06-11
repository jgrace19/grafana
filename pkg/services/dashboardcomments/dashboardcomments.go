package dashboardcomments

import (
	"context"

	"github.com/grafana/grafana/pkg/api/routing"
	"github.com/grafana/grafana/pkg/infra/db"
	"github.com/grafana/grafana/pkg/infra/log"
	"github.com/grafana/grafana/pkg/services/dashboards"
	"github.com/grafana/grafana/pkg/services/featuremgmt"
	"github.com/grafana/grafana/pkg/services/user"
)

func ProvideService(
	sqlStore db.DB,
	routeRegister routing.RouteRegister,
	dashboardService dashboards.DashboardService,
	features featuremgmt.FeatureToggles,
) *DashboardCommentsService {
	s := &DashboardCommentsService{
		store:            sqlStore,
		RouteRegister:    routeRegister,
		dashboardService: dashboardService,
		features:         features,
		log:              log.New("dashboard-comments"),
	}
	s.registerAPIEndpoints()
	return s
}

// Service is the dashboard comments domain API.
type Service interface {
	CreateComment(ctx context.Context, user *user.SignedInUser, cmd CreateCommentCmd) (CommentDTO, error)
	ListComments(ctx context.Context, user *user.SignedInUser, q ListCommentsQuery) ([]CommentDTO, error)
	DeleteComment(ctx context.Context, user *user.SignedInUser, id int64, dashboardUID string) error
}

// DashboardCommentsService implements Service.
type DashboardCommentsService struct {
	store            db.DB
	RouteRegister    routing.RouteRegister
	dashboardService dashboards.DashboardService
	features         featuremgmt.FeatureToggles
	log              log.Logger
}

func (s *DashboardCommentsService) CreateComment(ctx context.Context, u *user.SignedInUser, cmd CreateCommentCmd) (CommentDTO, error) {
	return s.createComment(ctx, u, cmd)
}

func (s *DashboardCommentsService) ListComments(ctx context.Context, u *user.SignedInUser, q ListCommentsQuery) ([]CommentDTO, error) {
	return s.listComments(ctx, u, q)
}

func (s *DashboardCommentsService) DeleteComment(ctx context.Context, u *user.SignedInUser, id int64, dashboardUID string) error {
	return s.deleteComment(ctx, u, id, dashboardUID)
}
