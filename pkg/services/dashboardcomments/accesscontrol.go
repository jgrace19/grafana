package dashboardcomments

import (
	ac "github.com/grafana/grafana/pkg/services/accesscontrol"
)

const (
	ActionDashboardCommentsRead   = "dashboards.comments:read"
	ActionDashboardCommentsCreate = "dashboards.comments:create"
	ActionDashboardCommentsAdmin  = "dashboards.comments:admin"
)

var (
	ScopeDashboardCommentsProvider = ac.NewScopeProvider("dashboards.comments")
	ScopeDashboardCommentsAll      = ScopeDashboardCommentsProvider.GetResourceAllScope()
)
