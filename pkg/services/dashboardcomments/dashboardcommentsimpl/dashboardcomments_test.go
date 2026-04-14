package dashboardcommentsimpl

import (
	"context"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"github.com/grafana/grafana/pkg/infra/db"
	"github.com/grafana/grafana/pkg/services/dashboardcomments"
	"github.com/grafana/grafana/pkg/services/user"
	"github.com/grafana/grafana/pkg/services/user/usertest"
	"github.com/grafana/grafana/pkg/tests/testsuite"
)

func TestMain(m *testing.M) {
	testsuite.Run(m)
}

func TestDashboardCommentsService(t *testing.T) {
	t.Run("Create comment", func(t *testing.T) {
		service, _ := setupTestService(t)
		ctx := context.Background()

		cmd := &dashboardcomments.CreateCommentCommand{
			OrgID:        1,
			DashboardUID: "test-dashboard",
			UserID:       1,
			Content:      "Test comment",
		}

		comment, err := service.Create(ctx, cmd)
		require.NoError(t, err)
		assert.NotEmpty(t, comment.UID)
		assert.Equal(t, "Test comment", comment.Content)
		assert.Equal(t, "test-dashboard", comment.DashboardUID)
		assert.False(t, comment.Resolved)
	})

	t.Run("Create comment with empty content fails", func(t *testing.T) {
		service, _ := setupTestService(t)
		ctx := context.Background()

		cmd := &dashboardcomments.CreateCommentCommand{
			OrgID:        1,
			DashboardUID: "test-dashboard",
			UserID:       1,
			Content:      "",
		}

		_, err := service.Create(ctx, cmd)
		require.Error(t, err)
		assert.Equal(t, dashboardcomments.ErrCommentContentEmpty, err)
	})

	t.Run("Create reply", func(t *testing.T) {
		service, _ := setupTestService(t)
		ctx := context.Background()

		parentCmd := &dashboardcomments.CreateCommentCommand{
			OrgID:        1,
			DashboardUID: "test-dashboard",
			UserID:       1,
			Content:      "Parent comment",
		}
		parent, err := service.Create(ctx, parentCmd)
		require.NoError(t, err)

		replyCmd := &dashboardcomments.CreateCommentCommand{
			OrgID:        1,
			DashboardUID: "test-dashboard",
			UserID:       2,
			Content:      "Reply comment",
			ParentID:     &parent.ID,
		}
		reply, err := service.Create(ctx, replyCmd)
		require.NoError(t, err)
		assert.Equal(t, parent.ID, *reply.ParentID)
	})

	t.Run("Cannot reply to a reply", func(t *testing.T) {
		service, _ := setupTestService(t)
		ctx := context.Background()

		parentCmd := &dashboardcomments.CreateCommentCommand{
			OrgID:        1,
			DashboardUID: "test-dashboard",
			UserID:       1,
			Content:      "Parent comment",
		}
		parent, err := service.Create(ctx, parentCmd)
		require.NoError(t, err)

		replyCmd := &dashboardcomments.CreateCommentCommand{
			OrgID:        1,
			DashboardUID: "test-dashboard",
			UserID:       2,
			Content:      "Reply comment",
			ParentID:     &parent.ID,
		}
		reply, err := service.Create(ctx, replyCmd)
		require.NoError(t, err)

		nestedReplyCmd := &dashboardcomments.CreateCommentCommand{
			OrgID:        1,
			DashboardUID: "test-dashboard",
			UserID:       3,
			Content:      "Nested reply",
			ParentID:     &reply.ID,
		}
		_, err = service.Create(ctx, nestedReplyCmd)
		require.Error(t, err)
		assert.Equal(t, dashboardcomments.ErrCannotReplyToReply, err)
	})

	t.Run("Update comment", func(t *testing.T) {
		service, _ := setupTestService(t)
		ctx := context.Background()

		createCmd := &dashboardcomments.CreateCommentCommand{
			OrgID:        1,
			DashboardUID: "test-dashboard",
			UserID:       1,
			Content:      "Original content",
		}
		comment, err := service.Create(ctx, createCmd)
		require.NoError(t, err)

		updateCmd := &dashboardcomments.UpdateCommentCommand{
			ID:      comment.ID,
			OrgID:   1,
			UserID:  1,
			Content: "Updated content",
		}
		updated, err := service.Update(ctx, updateCmd)
		require.NoError(t, err)
		assert.Equal(t, "Updated content", updated.Content)
	})

	t.Run("Update comment by different user fails", func(t *testing.T) {
		service, _ := setupTestService(t)
		ctx := context.Background()

		createCmd := &dashboardcomments.CreateCommentCommand{
			OrgID:        1,
			DashboardUID: "test-dashboard",
			UserID:       1,
			Content:      "Original content",
		}
		comment, err := service.Create(ctx, createCmd)
		require.NoError(t, err)

		updateCmd := &dashboardcomments.UpdateCommentCommand{
			ID:      comment.ID,
			OrgID:   1,
			UserID:  2,
			Content: "Updated content",
		}
		_, err = service.Update(ctx, updateCmd)
		require.Error(t, err)
		assert.Equal(t, dashboardcomments.ErrUnauthorized, err)
	})

	t.Run("Delete comment", func(t *testing.T) {
		service, _ := setupTestService(t)
		ctx := context.Background()

		createCmd := &dashboardcomments.CreateCommentCommand{
			OrgID:        1,
			DashboardUID: "test-dashboard",
			UserID:       1,
			Content:      "Test comment",
		}
		comment, err := service.Create(ctx, createCmd)
		require.NoError(t, err)

		deleteCmd := &dashboardcomments.DeleteCommentCommand{
			ID:     comment.ID,
			OrgID:  1,
			UserID: 1,
		}
		err = service.Delete(ctx, deleteCmd)
		require.NoError(t, err)

		_, err = service.Get(ctx, &dashboardcomments.GetCommentByIDQuery{
			ID:    comment.ID,
			OrgID: 1,
		})
		require.Error(t, err)
		assert.Equal(t, dashboardcomments.ErrCommentNotFound, err)
	})

	t.Run("Resolve comment", func(t *testing.T) {
		service, _ := setupTestService(t)
		ctx := context.Background()

		createCmd := &dashboardcomments.CreateCommentCommand{
			OrgID:        1,
			DashboardUID: "test-dashboard",
			UserID:       1,
			Content:      "Test comment",
		}
		comment, err := service.Create(ctx, createCmd)
		require.NoError(t, err)
		assert.False(t, comment.Resolved)

		resolveCmd := &dashboardcomments.ResolveCommentCommand{
			ID:         comment.ID,
			OrgID:      1,
			ResolvedBy: 2,
			Resolved:   true,
		}
		resolved, err := service.Resolve(ctx, resolveCmd)
		require.NoError(t, err)
		assert.True(t, resolved.Resolved)
		assert.NotNil(t, resolved.ResolvedBy)
		assert.Equal(t, int64(2), *resolved.ResolvedBy)
		assert.NotNil(t, resolved.ResolvedAt)
	})

	t.Run("Unresolve comment", func(t *testing.T) {
		service, _ := setupTestService(t)
		ctx := context.Background()

		createCmd := &dashboardcomments.CreateCommentCommand{
			OrgID:        1,
			DashboardUID: "test-dashboard",
			UserID:       1,
			Content:      "Test comment",
		}
		comment, err := service.Create(ctx, createCmd)
		require.NoError(t, err)

		resolveCmd := &dashboardcomments.ResolveCommentCommand{
			ID:         comment.ID,
			OrgID:      1,
			ResolvedBy: 2,
			Resolved:   true,
		}
		_, err = service.Resolve(ctx, resolveCmd)
		require.NoError(t, err)

		unresolveCmd := &dashboardcomments.ResolveCommentCommand{
			ID:         comment.ID,
			OrgID:      1,
			ResolvedBy: 2,
			Resolved:   false,
		}
		unresolved, err := service.Resolve(ctx, unresolveCmd)
		require.NoError(t, err)
		assert.False(t, unresolved.Resolved)
		assert.Nil(t, unresolved.ResolvedBy)
		assert.Nil(t, unresolved.ResolvedAt)
	})

	t.Run("List comments", func(t *testing.T) {
		service, _ := setupTestService(t)
		ctx := context.Background()

		for i := 0; i < 3; i++ {
			createCmd := &dashboardcomments.CreateCommentCommand{
				OrgID:        1,
				DashboardUID: "test-dashboard",
				UserID:       1,
				Content:      "Test comment",
			}
			_, err := service.Create(ctx, createCmd)
			require.NoError(t, err)
		}

		query := &dashboardcomments.GetCommentsQuery{
			OrgID:        1,
			DashboardUID: "test-dashboard",
		}
		comments, err := service.List(ctx, query)
		require.NoError(t, err)
		assert.Len(t, comments, 3)
	})

	t.Run("List comments with filter", func(t *testing.T) {
		service, _ := setupTestService(t)
		ctx := context.Background()

		createCmd := &dashboardcomments.CreateCommentCommand{
			OrgID:        1,
			DashboardUID: "test-dashboard",
			UserID:       1,
			Content:      "Test comment",
		}
		comment, err := service.Create(ctx, createCmd)
		require.NoError(t, err)

		resolveCmd := &dashboardcomments.ResolveCommentCommand{
			ID:         comment.ID,
			OrgID:      1,
			ResolvedBy: 1,
			Resolved:   true,
		}
		_, err = service.Resolve(ctx, resolveCmd)
		require.NoError(t, err)

		createCmd2 := &dashboardcomments.CreateCommentCommand{
			OrgID:        1,
			DashboardUID: "test-dashboard",
			UserID:       1,
			Content:      "Unresolved comment",
		}
		_, err = service.Create(ctx, createCmd2)
		require.NoError(t, err)

		resolved := false
		query := &dashboardcomments.GetCommentsQuery{
			OrgID:        1,
			DashboardUID: "test-dashboard",
			Resolved:     &resolved,
		}
		comments, err := service.List(ctx, query)
		require.NoError(t, err)
		assert.Len(t, comments, 1)
		assert.Equal(t, "Unresolved comment", comments[0].Content)
	})

	t.Run("Get comment count", func(t *testing.T) {
		service, _ := setupTestService(t)
		ctx := context.Background()

		for i := 0; i < 3; i++ {
			createCmd := &dashboardcomments.CreateCommentCommand{
				OrgID:        1,
				DashboardUID: "test-dashboard",
				UserID:       1,
				Content:      "Test comment",
			}
			comment, err := service.Create(ctx, createCmd)
			require.NoError(t, err)

			if i == 0 {
				resolveCmd := &dashboardcomments.ResolveCommentCommand{
					ID:         comment.ID,
					OrgID:      1,
					ResolvedBy: 1,
					Resolved:   true,
				}
				_, err = service.Resolve(ctx, resolveCmd)
				require.NoError(t, err)
			}
		}

		query := &dashboardcomments.GetCommentCountQuery{
			OrgID:        1,
			DashboardUID: "test-dashboard",
		}
		result, err := service.GetCount(ctx, query)
		require.NoError(t, err)
		assert.Equal(t, int64(3), result.Total)
		assert.Equal(t, int64(2), result.Unresolved)
	})
}

func setupTestService(t *testing.T) (dashboardcomments.Service, db.DB) {
	t.Helper()

	testDB := db.InitTestDB(t)

	fakeUserService := usertest.NewUserServiceFake()
	fakeUserService.ExpectedUser = &user.User{
		ID:    1,
		Login: "testuser",
		Name:  "Test User",
		Email: "test@example.com",
	}

	service := ProvideService(testDB, fakeUserService)

	return service, testDB
}
