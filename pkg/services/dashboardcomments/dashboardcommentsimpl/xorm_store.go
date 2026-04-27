package dashboardcommentsimpl

import (
	"context"
	"fmt"
	"strings"

	"github.com/grafana/grafana/pkg/infra/db"
	"github.com/grafana/grafana/pkg/infra/log"
	"github.com/grafana/grafana/pkg/services/dashboardcomments"
)

type xormStore struct {
	db  db.DB
	log log.Logger
}

func newXormStore(db db.DB, log log.Logger) *xormStore {
	return &xormStore{
		db:  db,
		log: log,
	}
}

func (s *xormStore) Create(ctx context.Context, comment *dashboardcomments.Comment) error {
	return s.db.WithDbSession(ctx, func(sess *db.Session) error {
		_, err := sess.Insert(comment)
		return err
	})
}

func (s *xormStore) Update(ctx context.Context, comment *dashboardcomments.Comment) error {
	return s.db.WithDbSession(ctx, func(sess *db.Session) error {
		_, err := sess.ID(comment.ID).AllCols().Update(comment)
		return err
	})
}

func (s *xormStore) Delete(ctx context.Context, id, orgID int64) error {
	return s.db.WithDbSession(ctx, func(sess *db.Session) error {
		_, err := sess.Where("id = ? AND org_id = ?", id, orgID).Delete(&dashboardcomments.Comment{})
		return err
	})
}

func (s *xormStore) Get(ctx context.Context, id, orgID int64) (*dashboardcomments.Comment, error) {
	comment := &dashboardcomments.Comment{}
	err := s.db.WithDbSession(ctx, func(sess *db.Session) error {
		found, err := sess.Where("id = ? AND org_id = ?", id, orgID).Get(comment)
		if err != nil {
			return err
		}
		if !found {
			return dashboardcomments.ErrCommentNotFound
		}
		return nil
	})
	if err != nil {
		return nil, err
	}
	return comment, nil
}

func (s *xormStore) GetByUID(ctx context.Context, uid string, orgID int64) (*dashboardcomments.Comment, error) {
	comment := &dashboardcomments.Comment{}
	err := s.db.WithDbSession(ctx, func(sess *db.Session) error {
		found, err := sess.Where("uid = ? AND org_id = ?", uid, orgID).Get(comment)
		if err != nil {
			return err
		}
		if !found {
			return dashboardcomments.ErrCommentNotFound
		}
		return nil
	})
	if err != nil {
		return nil, err
	}
	return comment, nil
}

func (s *xormStore) List(ctx context.Context, query *dashboardcomments.GetCommentsQuery) ([]*dashboardcomments.Comment, error) {
	var comments []*dashboardcomments.Comment
	err := s.db.WithDbSession(ctx, func(sess *db.Session) error {
		q := sess.Where("org_id = ? AND dashboard_uid = ?", query.OrgID, query.DashboardUID)

		if query.PanelID != nil {
			q = q.And("panel_id = ?", *query.PanelID)
		}

		if query.AnnotationID != nil {
			q = q.And("annotation_id = ?", *query.AnnotationID)
		}

		if query.ParentID != nil {
			q = q.And("parent_id = ?", *query.ParentID)
		} else if !query.IncludeReplies {
			q = q.And("parent_id IS NULL")
		}

		if query.Resolved != nil {
			q = q.And("resolved = ?", *query.Resolved)
		}

		if query.UserID != nil {
			q = q.And("user_id = ?", *query.UserID)
		}

		if query.TimeFrom != nil {
			q = q.And("time_from >= ?", *query.TimeFrom)
		}

		if query.TimeTo != nil {
			q = q.And("time_to <= ?", *query.TimeTo)
		}

		q = q.OrderBy("created DESC")

		if query.Limit > 0 {
			q = q.Limit(int(query.Limit), int(query.Offset))
		}

		return q.Find(&comments)
	})
	if err != nil {
		return nil, err
	}
	return comments, nil
}

func (s *xormStore) GetCount(ctx context.Context, query *dashboardcomments.GetCommentCountQuery) (*dashboardcomments.CommentCountResult, error) {
	result := &dashboardcomments.CommentCountResult{
		DashboardUID: query.DashboardUID,
		PanelID:      query.PanelID,
	}

	err := s.db.WithDbSession(ctx, func(sess *db.Session) error {
		conditions := []string{"org_id = ?", "dashboard_uid = ?", "parent_id IS NULL"}
		args := []interface{}{query.OrgID, query.DashboardUID}

		if query.PanelID != nil {
			conditions = append(conditions, "panel_id = ?")
			args = append(args, *query.PanelID)
		}

		whereClause := strings.Join(conditions, " AND ")

		total, err := sess.Where(whereClause, args...).Count(&dashboardcomments.Comment{})
		if err != nil {
			return err
		}
		result.Total = total

		unresolvedArgs := append(args, false)
		unresolved, err := sess.Where(whereClause+" AND resolved = ?", unresolvedArgs...).Count(&dashboardcomments.Comment{})
		if err != nil {
			return err
		}
		result.Unresolved = unresolved

		return nil
	})
	if err != nil {
		return nil, err
	}
	return result, nil
}

func (s *xormStore) GetPanelCounts(ctx context.Context, orgID int64, dashboardUID string) (map[int64]*dashboardcomments.CommentCountResult, error) {
	results := make(map[int64]*dashboardcomments.CommentCountResult)

	err := s.db.WithDbSession(ctx, func(sess *db.Session) error {
		type panelCount struct {
			PanelID    int64 `xorm:"panel_id"`
			Total      int64 `xorm:"total"`
			Unresolved int64 `xorm:"unresolved"`
		}

		var counts []panelCount
		err := sess.SQL(`
			SELECT 
				panel_id,
				COUNT(*) as total,
				SUM(CASE WHEN resolved = ? THEN 1 ELSE 0 END) as unresolved
			FROM dashboard_comment
			WHERE org_id = ? AND dashboard_uid = ? AND parent_id IS NULL AND panel_id IS NOT NULL
			GROUP BY panel_id
		`, false, orgID, dashboardUID).Find(&counts)

		if err != nil {
			return err
		}

		for _, c := range counts {
			panelID := c.PanelID
			results[c.PanelID] = &dashboardcomments.CommentCountResult{
				DashboardUID: dashboardUID,
				PanelID:      &panelID,
				Total:        c.Total,
				Unresolved:   c.Unresolved,
			}
		}

		return nil
	})
	if err != nil {
		return nil, err
	}
	return results, nil
}

func (s *xormStore) GetReplyCount(ctx context.Context, parentID int64) (int64, error) {
	var count int64
	err := s.db.WithDbSession(ctx, func(sess *db.Session) error {
		var err error
		count, err = sess.Where("parent_id = ?", parentID).Count(&dashboardcomments.Comment{})
		return err
	})
	return count, err
}

func (s *xormStore) CreateMention(ctx context.Context, mention *dashboardcomments.Mention) error {
	return s.db.WithDbSession(ctx, func(sess *db.Session) error {
		_, err := sess.Insert(mention)
		return err
	})
}

func (s *xormStore) DeleteMentionsByCommentID(ctx context.Context, commentID int64) error {
	return s.db.WithDbSession(ctx, func(sess *db.Session) error {
		_, err := sess.Where("comment_id = ?", commentID).Delete(&dashboardcomments.Mention{})
		return err
	})
}

func (s *xormStore) GetMentionsByCommentID(ctx context.Context, commentID int64) ([]*dashboardcomments.Mention, error) {
	var mentions []*dashboardcomments.Mention
	err := s.db.WithDbSession(ctx, func(sess *db.Session) error {
		return sess.Where("comment_id = ?", commentID).Find(&mentions)
	})
	if err != nil {
		return nil, fmt.Errorf("failed to get mentions: %w", err)
	}
	return mentions, nil
}
