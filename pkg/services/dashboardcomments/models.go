package dashboardcomments

import (
	"time"
)

type Comment struct {
	ID           int64      `json:"id" xorm:"pk autoincr 'id'"`
	UID          string     `json:"uid" xorm:"uid"`
	OrgID        int64      `json:"orgId" xorm:"org_id"`
	DashboardUID string     `json:"dashboardUid" xorm:"dashboard_uid"`
	PanelID      *int64     `json:"panelId,omitempty" xorm:"panel_id"`
	AnnotationID *int64     `json:"annotationId,omitempty" xorm:"annotation_id"`
	ParentID     *int64     `json:"parentId,omitempty" xorm:"parent_id"`
	UserID       int64      `json:"userId" xorm:"user_id"`
	Content      string     `json:"content"`
	Resolved     bool       `json:"resolved"`
	ResolvedBy   *int64     `json:"resolvedBy,omitempty" xorm:"resolved_by"`
	ResolvedAt   *time.Time `json:"resolvedAt,omitempty" xorm:"resolved_at"`
	TimeFrom     *int64     `json:"timeFrom,omitempty" xorm:"time_from"`
	TimeTo       *int64     `json:"timeTo,omitempty" xorm:"time_to"`
	Created      time.Time  `json:"created"`
	Updated      time.Time  `json:"updated"`
}

func (c Comment) TableName() string {
	return "dashboard_comment"
}

type CommentDTO struct {
	ID           int64      `json:"id"`
	UID          string     `json:"uid"`
	DashboardUID string     `json:"dashboardUid"`
	PanelID      *int64     `json:"panelId,omitempty"`
	AnnotationID *int64     `json:"annotationId,omitempty"`
	ParentID     *int64     `json:"parentId,omitempty"`
	UserID       int64      `json:"userId"`
	UserLogin    string     `json:"userLogin"`
	UserName     string     `json:"userName"`
	UserEmail    string     `json:"userEmail"`
	Content      string     `json:"content"`
	Resolved     bool       `json:"resolved"`
	ResolvedBy   *int64     `json:"resolvedBy,omitempty"`
	ResolvedAt   *time.Time `json:"resolvedAt,omitempty"`
	TimeFrom     *int64     `json:"timeFrom,omitempty"`
	TimeTo       *int64     `json:"timeTo,omitempty"`
	Created      time.Time  `json:"created"`
	Updated      time.Time  `json:"updated"`
	ReplyCount   int64      `json:"replyCount"`
	Mentions     []Mention  `json:"mentions,omitempty"`
	Replies      []CommentDTO `json:"replies,omitempty"`
}

type Mention struct {
	ID        int64     `json:"id" xorm:"pk autoincr 'id'"`
	CommentID int64     `json:"commentId" xorm:"comment_id"`
	UserID    int64     `json:"userId" xorm:"user_id"`
	Notified  bool      `json:"notified"`
	Created   time.Time `json:"created"`
}

func (m Mention) TableName() string {
	return "comment_mention"
}

type MentionDTO struct {
	UserID    int64  `json:"userId"`
	UserLogin string `json:"userLogin"`
	UserName  string `json:"userName"`
}

type CreateCommentCommand struct {
	OrgID        int64   `json:"-"`
	DashboardUID string  `json:"dashboardUid" binding:"Required"`
	PanelID      *int64  `json:"panelId,omitempty"`
	AnnotationID *int64  `json:"annotationId,omitempty"`
	ParentID     *int64  `json:"parentId,omitempty"`
	UserID       int64   `json:"-"`
	Content      string  `json:"content" binding:"Required"`
	TimeFrom     *int64  `json:"timeFrom,omitempty"`
	TimeTo       *int64  `json:"timeTo,omitempty"`
	MentionedUserIDs []int64 `json:"mentionedUserIds,omitempty"`
}

type UpdateCommentCommand struct {
	ID      int64  `json:"-"`
	OrgID   int64  `json:"-"`
	UserID  int64  `json:"-"`
	Content string `json:"content" binding:"Required"`
	MentionedUserIDs []int64 `json:"mentionedUserIds,omitempty"`
}

type ResolveCommentCommand struct {
	ID         int64 `json:"-"`
	OrgID      int64 `json:"-"`
	ResolvedBy int64 `json:"-"`
	Resolved   bool  `json:"resolved"`
}

type DeleteCommentCommand struct {
	ID     int64 `json:"-"`
	OrgID  int64 `json:"-"`
	UserID int64 `json:"-"`
}

type GetCommentsQuery struct {
	OrgID        int64
	DashboardUID string
	PanelID      *int64
	AnnotationID *int64
	ParentID     *int64
	Resolved     *bool
	UserID       *int64
	TimeFrom     *int64
	TimeTo       *int64
	Limit        int64
	Offset       int64
	IncludeReplies bool
}

type GetCommentByIDQuery struct {
	ID    int64
	OrgID int64
}

type GetCommentByUIDQuery struct {
	UID   string
	OrgID int64
}

type GetCommentCountQuery struct {
	OrgID        int64
	DashboardUID string
	PanelID      *int64
	Resolved     *bool
}

type CommentCountResult struct {
	DashboardUID string `json:"dashboardUid"`
	PanelID      *int64 `json:"panelId,omitempty"`
	Total        int64  `json:"total"`
	Unresolved   int64  `json:"unresolved"`
}
