package dashboardcomments

import (
	"context"
	"strconv"
	"strings"

	"github.com/grafana/grafana/pkg/infra/db"
	"github.com/grafana/grafana/pkg/services/user"
)

func (s *DashboardCommentsService) createComment(ctx context.Context, u *user.SignedInUser, cmd CreateCommentCmd) (CommentDTO, error) {
	if strings.TrimSpace(cmd.DashboardUID) == "" || strings.TrimSpace(cmd.Content) == "" {
		return CommentDTO{}, ErrInvalidInput
	}

	var annotationID *int64
	if cmd.AnnotationID != nil && *cmd.AnnotationID != "" {
		id, err := strconv.ParseInt(strings.TrimSpace(*cmd.AnnotationID), 10, 64)
		if err != nil {
			return CommentDTO{}, ErrInvalidInput
		}
		annotationID = &id
	}

	var out Comment
	err := s.store.WithTransactionalDbSession(ctx, func(sess *db.Session) error {
		if cmd.ParentID != nil {
			var parent Comment
			has, err := sess.ID(*cmd.ParentID).Where("org_id = ?", u.OrgID).Get(&parent)
			if err != nil {
				return err
			}
			if !has {
				return ErrNotFound
			}
			if parent.DashboardUID != cmd.DashboardUID {
				return ErrForbidden
			}
			if parent.ParentID != nil {
				return ErrInvalidParentDepth
			}
		}

		now := nowMs()
		row := &Comment{
			OrgID:        u.OrgID,
			DashboardUID: cmd.DashboardUID,
			PanelID:      cmd.PanelID,
			AnnotationID: annotationID,
			ParentID:     cmd.ParentID,
			UserID:       u.UserID,
			Content:      cmd.Content,
			Created:      now,
			Updated:      now,
		}
		_, err := sess.Insert(row)
		if err != nil {
			return err
		}
		out = *row
		return nil
	})
	if err != nil {
		return CommentDTO{}, err
	}
	return commentToDTO(&out), nil
}

func (s *DashboardCommentsService) listComments(ctx context.Context, u *user.SignedInUser, q ListCommentsQuery) ([]CommentDTO, error) {
	if strings.TrimSpace(q.DashboardUID) == "" {
		return nil, ErrInvalidInput
	}

	var rows []Comment
	err := s.store.WithDbSession(ctx, func(sess *db.Session) error {
		return sess.Where("org_id = ? AND dashboard_uid = ?", u.OrgID, q.DashboardUID).Asc("created", "id").Find(&rows)
	})
	if err != nil {
		return nil, err
	}
	out := make([]CommentDTO, 0, len(rows))
	for i := range rows {
		out = append(out, commentToDTO(&rows[i]))
	}
	return out, nil
}

func (s *DashboardCommentsService) deleteComment(ctx context.Context, u *user.SignedInUser, id int64, dashboardUID string) error {
	if strings.TrimSpace(dashboardUID) == "" {
		return ErrInvalidInput
	}
	return s.store.WithTransactionalDbSession(ctx, func(sess *db.Session) error {
		var row Comment
		has, err := sess.ID(id).Where("org_id = ?", u.OrgID).Get(&row)
		if err != nil {
			return err
		}
		if !has {
			return ErrNotFound
		}
		if row.DashboardUID != dashboardUID {
			return ErrForbidden
		}
		if row.UserID != u.UserID {
			return ErrForbidden
		}
		_, err = sess.ID(id).Where("org_id = ?", u.OrgID).Delete(&Comment{})
		return err
	})
}
