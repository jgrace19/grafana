package migrations

import (
	. "github.com/grafana/grafana/pkg/services/sqlstore/migrator"
)

func addDashboardCommentMigrations(mg *Migrator) {
	dashboardCommentV1 := Table{
		Name: "dashboard_comment",
		Columns: []*Column{
			{Name: "id", Type: DB_BigInt, IsPrimaryKey: true, IsAutoIncrement: true},
			{Name: "uid", Type: DB_NVarchar, Length: 40, Nullable: false},
			{Name: "org_id", Type: DB_BigInt, Nullable: false},
			{Name: "dashboard_uid", Type: DB_NVarchar, Length: 40, Nullable: false},
			{Name: "panel_id", Type: DB_BigInt, Nullable: true},
			{Name: "annotation_id", Type: DB_BigInt, Nullable: true},
			{Name: "parent_id", Type: DB_BigInt, Nullable: true},
			{Name: "user_id", Type: DB_BigInt, Nullable: false},
			{Name: "content", Type: DB_Text, Nullable: false},
			{Name: "resolved", Type: DB_Bool, Nullable: false, Default: "0"},
			{Name: "resolved_by", Type: DB_BigInt, Nullable: true},
			{Name: "resolved_at", Type: DB_DateTime, Nullable: true},
			{Name: "time_from", Type: DB_BigInt, Nullable: true},
			{Name: "time_to", Type: DB_BigInt, Nullable: true},
			{Name: "created", Type: DB_DateTime, Nullable: false},
			{Name: "updated", Type: DB_DateTime, Nullable: false},
		},
		Indices: []*Index{
			{Cols: []string{"uid"}, Type: UniqueIndex},
			{Cols: []string{"org_id", "dashboard_uid"}},
			{Cols: []string{"org_id", "dashboard_uid", "panel_id"}},
			{Cols: []string{"parent_id"}},
			{Cols: []string{"user_id"}},
			{Cols: []string{"annotation_id"}},
		},
	}

	mg.AddMigration("create dashboard_comment table v1", NewAddTableMigration(dashboardCommentV1))
	mg.AddMigration("add unique index dashboard_comment.uid", NewAddIndexMigration(dashboardCommentV1, dashboardCommentV1.Indices[0]))
	mg.AddMigration("add index dashboard_comment.org_id_dashboard_uid", NewAddIndexMigration(dashboardCommentV1, dashboardCommentV1.Indices[1]))
	mg.AddMigration("add index dashboard_comment.org_id_dashboard_uid_panel_id", NewAddIndexMigration(dashboardCommentV1, dashboardCommentV1.Indices[2]))
	mg.AddMigration("add index dashboard_comment.parent_id", NewAddIndexMigration(dashboardCommentV1, dashboardCommentV1.Indices[3]))
	mg.AddMigration("add index dashboard_comment.user_id", NewAddIndexMigration(dashboardCommentV1, dashboardCommentV1.Indices[4]))
	mg.AddMigration("add index dashboard_comment.annotation_id", NewAddIndexMigration(dashboardCommentV1, dashboardCommentV1.Indices[5]))

	commentMentionV1 := Table{
		Name: "comment_mention",
		Columns: []*Column{
			{Name: "id", Type: DB_BigInt, IsPrimaryKey: true, IsAutoIncrement: true},
			{Name: "comment_id", Type: DB_BigInt, Nullable: false},
			{Name: "user_id", Type: DB_BigInt, Nullable: false},
			{Name: "notified", Type: DB_Bool, Nullable: false, Default: "0"},
			{Name: "created", Type: DB_DateTime, Nullable: false},
		},
		Indices: []*Index{
			{Cols: []string{"comment_id"}},
			{Cols: []string{"user_id"}},
			{Cols: []string{"comment_id", "user_id"}, Type: UniqueIndex},
		},
	}

	mg.AddMigration("create comment_mention table v1", NewAddTableMigration(commentMentionV1))
	mg.AddMigration("add index comment_mention.comment_id", NewAddIndexMigration(commentMentionV1, commentMentionV1.Indices[0]))
	mg.AddMigration("add index comment_mention.user_id", NewAddIndexMigration(commentMentionV1, commentMentionV1.Indices[1]))
	mg.AddMigration("add unique index comment_mention.comment_id_user_id", NewAddIndexMigration(commentMentionV1, commentMentionV1.Indices[2]))
}
