package dashboardcommentsimpl

import (
	"context"
	"strings"
	"time"

	"github.com/grafana/grafana/pkg/infra/db"
	"github.com/grafana/grafana/pkg/infra/log"
	"github.com/grafana/grafana/pkg/services/dashboardcomments"
	"github.com/grafana/grafana/pkg/services/user"
	"github.com/grafana/grafana/pkg/util"
)

type Service struct {
	store       store
	userService user.Service
	log         log.Logger
}

func ProvideService(db db.DB, userService user.Service) dashboardcomments.Service {
	logger := log.New("dashboardcomments")
	return &Service{
		store:       newXormStore(db, logger),
		userService: userService,
		log:         logger,
	}
}

func (s *Service) Create(ctx context.Context, cmd *dashboardcomments.CreateCommentCommand) (*dashboardcomments.CommentDTO, error) {
	if strings.TrimSpace(cmd.Content) == "" {
		return nil, dashboardcomments.ErrCommentContentEmpty
	}

	if cmd.ParentID != nil {
		parent, err := s.store.Get(ctx, *cmd.ParentID, cmd.OrgID)
		if err != nil {
			return nil, dashboardcomments.ErrInvalidParent
		}
		if parent.ParentID != nil {
			return nil, dashboardcomments.ErrCannotReplyToReply
		}
	}

	now := time.Now()
	comment := &dashboardcomments.Comment{
		UID:          util.GenerateShortUID(),
		OrgID:        cmd.OrgID,
		DashboardUID: cmd.DashboardUID,
		PanelID:      cmd.PanelID,
		AnnotationID: cmd.AnnotationID,
		ParentID:     cmd.ParentID,
		UserID:       cmd.UserID,
		Content:      cmd.Content,
		Resolved:     false,
		TimeFrom:     cmd.TimeFrom,
		TimeTo:       cmd.TimeTo,
		Created:      now,
		Updated:      now,
	}

	if err := s.store.Create(ctx, comment); err != nil {
		return nil, err
	}

	for _, userID := range cmd.MentionedUserIDs {
		mention := &dashboardcomments.Mention{
			CommentID: comment.ID,
			UserID:    userID,
			Notified:  false,
			Created:   now,
		}
		if err := s.store.CreateMention(ctx, mention); err != nil {
			s.log.Warn("Failed to create mention", "commentId", comment.ID, "userId", userID, "error", err)
		}
	}

	return s.toDTO(ctx, comment)
}

func (s *Service) Update(ctx context.Context, cmd *dashboardcomments.UpdateCommentCommand) (*dashboardcomments.CommentDTO, error) {
	if strings.TrimSpace(cmd.Content) == "" {
		return nil, dashboardcomments.ErrCommentContentEmpty
	}

	comment, err := s.store.Get(ctx, cmd.ID, cmd.OrgID)
	if err != nil {
		return nil, err
	}

	if comment.UserID != cmd.UserID {
		return nil, dashboardcomments.ErrUnauthorized
	}

	comment.Content = cmd.Content
	comment.Updated = time.Now()

	if err := s.store.Update(ctx, comment); err != nil {
		return nil, err
	}

	if err := s.store.DeleteMentionsByCommentID(ctx, comment.ID); err != nil {
		s.log.Warn("Failed to delete old mentions", "commentId", comment.ID, "error", err)
	}

	for _, userID := range cmd.MentionedUserIDs {
		mention := &dashboardcomments.Mention{
			CommentID: comment.ID,
			UserID:    userID,
			Notified:  false,
			Created:   time.Now(),
		}
		if err := s.store.CreateMention(ctx, mention); err != nil {
			s.log.Warn("Failed to create mention", "commentId", comment.ID, "userId", userID, "error", err)
		}
	}

	return s.toDTO(ctx, comment)
}

func (s *Service) Delete(ctx context.Context, cmd *dashboardcomments.DeleteCommentCommand) error {
	comment, err := s.store.Get(ctx, cmd.ID, cmd.OrgID)
	if err != nil {
		return err
	}

	if comment.UserID != cmd.UserID {
		return dashboardcomments.ErrUnauthorized
	}

	if err := s.store.DeleteMentionsByCommentID(ctx, comment.ID); err != nil {
		s.log.Warn("Failed to delete mentions", "commentId", comment.ID, "error", err)
	}

	return s.store.Delete(ctx, cmd.ID, cmd.OrgID)
}

func (s *Service) Resolve(ctx context.Context, cmd *dashboardcomments.ResolveCommentCommand) (*dashboardcomments.CommentDTO, error) {
	comment, err := s.store.Get(ctx, cmd.ID, cmd.OrgID)
	if err != nil {
		return nil, err
	}

	now := time.Now()
	comment.Resolved = cmd.Resolved
	if cmd.Resolved {
		comment.ResolvedBy = &cmd.ResolvedBy
		comment.ResolvedAt = &now
	} else {
		comment.ResolvedBy = nil
		comment.ResolvedAt = nil
	}
	comment.Updated = now

	if err := s.store.Update(ctx, comment); err != nil {
		return nil, err
	}

	return s.toDTO(ctx, comment)
}

func (s *Service) Get(ctx context.Context, query *dashboardcomments.GetCommentByIDQuery) (*dashboardcomments.CommentDTO, error) {
	comment, err := s.store.Get(ctx, query.ID, query.OrgID)
	if err != nil {
		return nil, err
	}
	return s.toDTO(ctx, comment)
}

func (s *Service) GetByUID(ctx context.Context, query *dashboardcomments.GetCommentByUIDQuery) (*dashboardcomments.CommentDTO, error) {
	comment, err := s.store.GetByUID(ctx, query.UID, query.OrgID)
	if err != nil {
		return nil, err
	}
	return s.toDTO(ctx, comment)
}

func (s *Service) List(ctx context.Context, query *dashboardcomments.GetCommentsQuery) ([]*dashboardcomments.CommentDTO, error) {
	comments, err := s.store.List(ctx, query)
	if err != nil {
		return nil, err
	}

	dtos := make([]*dashboardcomments.CommentDTO, 0, len(comments))
	for _, comment := range comments {
		dto, err := s.toDTO(ctx, comment)
		if err != nil {
			s.log.Warn("Failed to convert comment to DTO", "commentId", comment.ID, "error", err)
			continue
		}

		if query.IncludeReplies && comment.ParentID == nil {
			replies, err := s.store.List(ctx, &dashboardcomments.GetCommentsQuery{
				OrgID:        query.OrgID,
				DashboardUID: query.DashboardUID,
				ParentID:     &comment.ID,
			})
			if err == nil {
				for _, reply := range replies {
					replyDTO, err := s.toDTO(ctx, reply)
					if err == nil {
						dto.Replies = append(dto.Replies, *replyDTO)
					}
				}
			}
		}

		dtos = append(dtos, dto)
	}

	return dtos, nil
}

func (s *Service) GetCount(ctx context.Context, query *dashboardcomments.GetCommentCountQuery) (*dashboardcomments.CommentCountResult, error) {
	return s.store.GetCount(ctx, query)
}

func (s *Service) GetPanelCounts(ctx context.Context, orgID int64, dashboardUID string) (map[int64]*dashboardcomments.CommentCountResult, error) {
	return s.store.GetPanelCounts(ctx, orgID, dashboardUID)
}

func (s *Service) toDTO(ctx context.Context, comment *dashboardcomments.Comment) (*dashboardcomments.CommentDTO, error) {
	dto := &dashboardcomments.CommentDTO{
		ID:           comment.ID,
		UID:          comment.UID,
		DashboardUID: comment.DashboardUID,
		PanelID:      comment.PanelID,
		AnnotationID: comment.AnnotationID,
		ParentID:     comment.ParentID,
		UserID:       comment.UserID,
		Content:      comment.Content,
		Resolved:     comment.Resolved,
		ResolvedBy:   comment.ResolvedBy,
		ResolvedAt:   comment.ResolvedAt,
		TimeFrom:     comment.TimeFrom,
		TimeTo:       comment.TimeTo,
		Created:      comment.Created,
		Updated:      comment.Updated,
	}

	userInfo, err := s.userService.GetByID(ctx, &user.GetUserByIDQuery{ID: comment.UserID})
	if err == nil {
		dto.UserLogin = userInfo.Login
		dto.UserName = userInfo.Name
		dto.UserEmail = userInfo.Email
	}

	if comment.ParentID == nil {
		replyCount, err := s.store.GetReplyCount(ctx, comment.ID)
		if err == nil {
			dto.ReplyCount = replyCount
		}
	}

	mentions, err := s.store.GetMentionsByCommentID(ctx, comment.ID)
	if err == nil {
		for _, mention := range mentions {
			dto.Mentions = append(dto.Mentions, *mention)
		}
	}

	return dto, nil
}
