package migrations

import (
	. "github.com/grafana/grafana/pkg/services/sqlstore/migrator"
)

func addDashboardCommentMigrations(mg *Migrator) {
	table := Table{
		Name: "dashboard_comment",
		Columns: []*Column{
			{Name: "id", Type: DB_BigInt, Nullable: false, IsPrimaryKey: true, IsAutoIncrement: true},
			{Name: "org_id", Type: DB_BigInt, Nullable: false},
			{Name: "dashboard_uid", Type: DB_NVarchar, Length: 40, Nullable: false},
			{Name: "panel_id", Type: DB_BigInt, Nullable: false, Default: "0"},
			{Name: "annotation_id", Type: DB_BigInt, Nullable: true},
			{Name: "parent_id", Type: DB_BigInt, Nullable: true},
			{Name: "user_id", Type: DB_BigInt, Nullable: false},
			{Name: "content", Type: DB_Text, Nullable: false},
			{Name: "created", Type: DB_BigInt, Nullable: false},
			{Name: "updated", Type: DB_BigInt, Nullable: false},
		},
		Indices: []*Index{
			{Cols: []string{"org_id", "dashboard_uid"}, Type: IndexType},
			{Cols: []string{"annotation_id"}, Type: IndexType},
			{Cols: []string{"parent_id"}, Type: IndexType},
		},
	}

	mg.AddMigration("create dashboard_comment table v1", NewAddTableMigration(table))
	mg.AddMigration("add index dashboard_comment.org_id-dashboard_uid", NewAddIndexMigration(table, table.Indices[0]))
	mg.AddMigration("add index dashboard_comment.annotation_id", NewAddIndexMigration(table, table.Indices[1]))
	mg.AddMigration("add index dashboard_comment.parent_id", NewAddIndexMigration(table, table.Indices[2]))
}
