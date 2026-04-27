package dashboardcomments

import (
	"errors"
	"strconv"
	"time"
)

var (
	ErrNotFound           = errors.New("comment not found")
	ErrForbidden          = errors.New("forbidden")
	ErrInvalidParentDepth = errors.New("replies can only be one level deep")
	ErrDashboardAccess    = errors.New("dashboard not found or access denied")
	ErrInvalidInput       = errors.New("invalid input")
)

// Comment is the database row for dashboard_comment.
type Comment struct {
	ID           int64  `xorm:"pk autoincr 'id'"`
	OrgID        int64  `xorm:"org_id"`
	DashboardUID string `xorm:"dashboard_uid"`
	PanelID      int64  `xorm:"panel_id"`
	AnnotationID *int64 `xorm:"annotation_id"`
	ParentID     *int64 `xorm:"parent_id"`
	UserID       int64  `xorm:"user_id"`
	Content      string `xorm:"content"`
	Created      int64  `xorm:"created"`
	Updated      int64  `xorm:"updated"`
}

func (Comment) TableName() string {
	return "dashboard_comment"
}

// CommentDTO is the API representation.
type CommentDTO struct {
	ID             int64   `json:"id"`
	DashboardUID   string  `json:"dashboardUid"`
	PanelID        int64   `json:"panelId"`
	AnnotationID   *string `json:"annotationId,omitempty"`
	ParentID       *int64  `json:"parentId,omitempty"`
	UserID         int64   `json:"userId"`
	Content        string  `json:"content"`
	Created        int64   `json:"created"`
	Updated        int64   `json:"updated"`
}

// CreateCommentCmd creates a comment.
type CreateCommentCmd struct {
	DashboardUID string
	PanelID      int64
	Content      string
	ParentID     *int64
	AnnotationID *string
}

// ListCommentsQuery lists all comments for a dashboard.
type ListCommentsQuery struct {
	DashboardUID string
}

func commentToDTO(c *Comment) CommentDTO {
	dto := CommentDTO{
		ID:           c.ID,
		DashboardUID: c.DashboardUID,
		PanelID:      c.PanelID,
		ParentID:     c.ParentID,
		UserID:       c.UserID,
		Content:      c.Content,
		Created:      c.Created,
		Updated:      c.Updated,
	}
	if c.AnnotationID != nil {
		s := strconv.FormatInt(*c.AnnotationID, 10)
		dto.AnnotationID = &s
	}
	return dto
}

func nowMs() int64 {
	return time.Now().UnixMilli()
}
