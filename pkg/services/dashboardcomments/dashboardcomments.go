package dashboardcomments

import (
	"context"
	"errors"
)

var (
	ErrCommentNotFound     = errors.New("comment not found")
	ErrUnauthorized        = errors.New("unauthorized to perform this action")
	ErrInvalidParent       = errors.New("invalid parent comment")
	ErrCannotReplyToReply  = errors.New("cannot reply to a reply")
	ErrCommentContentEmpty = errors.New("comment content cannot be empty")
)

type Service interface {
	Create(ctx context.Context, cmd *CreateCommentCommand) (*CommentDTO, error)
	Update(ctx context.Context, cmd *UpdateCommentCommand) (*CommentDTO, error)
	Delete(ctx context.Context, cmd *DeleteCommentCommand) error
	Resolve(ctx context.Context, cmd *ResolveCommentCommand) (*CommentDTO, error)
	Get(ctx context.Context, query *GetCommentByIDQuery) (*CommentDTO, error)
	GetByUID(ctx context.Context, query *GetCommentByUIDQuery) (*CommentDTO, error)
	List(ctx context.Context, query *GetCommentsQuery) ([]*CommentDTO, error)
	GetCount(ctx context.Context, query *GetCommentCountQuery) (*CommentCountResult, error)
	GetPanelCounts(ctx context.Context, orgID int64, dashboardUID string) (map[int64]*CommentCountResult, error)
}
