package dtos

type CreateDashboardCommentCmd struct {
	PanelID          *int64  `json:"panelId,omitempty"`
	AnnotationID     *int64  `json:"annotationId,omitempty"`
	ParentID         *int64  `json:"parentId,omitempty"`
	Content          string  `json:"content" binding:"Required"`
	TimeFrom         *int64  `json:"timeFrom,omitempty"`
	TimeTo           *int64  `json:"timeTo,omitempty"`
	MentionedUserIDs []int64 `json:"mentionedUserIds,omitempty"`
}

type UpdateDashboardCommentCmd struct {
	Content          string  `json:"content" binding:"Required"`
	MentionedUserIDs []int64 `json:"mentionedUserIds,omitempty"`
}

type ResolveDashboardCommentCmd struct {
	Resolved bool `json:"resolved"`
}
