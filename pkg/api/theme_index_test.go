package api

import (
	"testing"

	"github.com/grafana/grafana/pkg/services/featuremgmt"
	pref "github.com/grafana/grafana/pkg/services/preference"
	"github.com/grafana/grafana/pkg/setting"
	"github.com/stretchr/testify/require"
)

func TestHTTPServer_getThemeForIndexData_withPurplePreference(t *testing.T) {
	t.Run("uses purple preference without experimental toggle", func(t *testing.T) {
		hs := &HTTPServer{
			Cfg:      setting.NewCfg(),
			Features: featuremgmt.WithFeatures(featuremgmt.FlagGrafanaconThemes, false),
		}
		hs.Cfg.DefaultTheme = "dark"

		theme := hs.getThemeForIndexData("purple", "")
		require.NotNil(t, theme)
		require.Equal(t, "purple", theme.ID)
		require.False(t, theme.IsExtra)
	})

	t.Run("uses purple theme url override without experimental toggle", func(t *testing.T) {
		hs := &HTTPServer{
			Cfg:      setting.NewCfg(),
			Features: featuremgmt.WithFeatures(featuremgmt.FlagGrafanaconThemes, false),
		}
		hs.Cfg.DefaultTheme = "dark"

		theme := hs.getThemeForIndexData("dark", "purple")
		require.NotNil(t, theme)
		require.Equal(t, "purple", theme.ID)
		require.False(t, theme.IsExtra)
	})
}

func TestThemeRegistry_hasPurpleAsBuiltIn(t *testing.T) {
	require.True(t, pref.IsValidThemeID("purple"))
	theme := pref.GetThemeByID("purple")
	require.NotNil(t, theme)
	require.False(t, theme.IsExtra)
}
