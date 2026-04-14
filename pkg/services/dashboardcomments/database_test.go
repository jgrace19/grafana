package dashboardcomments

import (
	"context"
	"testing"

	"github.com/stretchr/testify/require"

	"github.com/grafana/grafana/pkg/infra/db"
	"github.com/grafana/grafana/pkg/services/org"
	"github.com/grafana/grafana/pkg/services/user"
	"github.com/grafana/grafana/pkg/tests/testsuite"
)

func TestMain(m *testing.M) {
	testsuite.Run(m)
}

func TestCreateComment_TwoLevelThreading(t *testing.T) {
	sqlStore := db.InitTestDB(t)
	s := &DashboardCommentsService{store: sqlStore}

	u := &user.SignedInUser{UserID: 1, OrgID: 1, OrgRole: org.RoleEditor}

	top, err := s.createComment(context.Background(), u, CreateCommentCmd{
		DashboardUID: "dash-uid",
		PanelID:      1,
		Content:      "top",
	})
	require.NoError(t, err)
	require.NotZero(t, top.ID)

	reply, err := s.createComment(context.Background(), u, CreateCommentCmd{
		DashboardUID: "dash-uid",
		PanelID:      1,
		Content:      "reply",
		ParentID:     &top.ID,
	})
	require.NoError(t, err)

	_, err = s.createComment(context.Background(), u, CreateCommentCmd{
		DashboardUID: "dash-uid",
		PanelID:      1,
		Content:      "too deep",
		ParentID:     &reply.ID,
	})
	require.ErrorIs(t, err, ErrInvalidParentDepth)
}
