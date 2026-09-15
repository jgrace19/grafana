package dashboardcommentsimpl

import (
	"context"

	"github.com/grafana/grafana/pkg/services/dashboardcomments"
)

type store interface {
	Create(ctx context.Context, comment *dashboardcomments.Comment) error
	Update(ctx context.Context, comment *dashboardcomments.Comment) error
	Delete(ctx context.Context, id, orgID int64) error
	Get(ctx context.Context, id, orgID int64) (*dashboardcomments.Comment, error)
	GetByUID(ctx context.Context, uid string, orgID int64) (*dashboardcomments.Comment, error)
	List(ctx context.Context, query *dashboardcomments.GetCommentsQuery) ([]*dashboardcomments.Comment, error)
	GetCount(ctx context.Context, query *dashboardcomments.GetCommentCountQuery) (*dashboardcomments.CommentCountResult, error)
	GetPanelCounts(ctx context.Context, orgID int64, dashboardUID string) (map[int64]*dashboardcomments.CommentCountResult, error)
	GetReplyCount(ctx context.Context, parentID int64) (int64, error)
	
	CreateMention(ctx context.Context, mention *dashboardcomments.Mention) error
	DeleteMentionsByCommentID(ctx context.Context, commentID int64) error
	GetMentionsByCommentID(ctx context.Context, commentID int64) ([]*dashboardcomments.Mention, error)
}
