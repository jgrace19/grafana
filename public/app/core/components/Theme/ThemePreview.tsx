import * as stylex from '@stylexjs/stylex';

import { type GrafanaTheme2, ThemeContext } from '@grafana/data';
import { Trans } from '@grafana/i18n';
import { Box, Divider, Icon, Stack, useTheme2 } from '@grafana/ui';
import { ScopedThemeVars } from '@grafana/ui/internal';
import { colors, components, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';

import { Branding } from '../Branding/Branding';

interface ThemePreviewProps {
  theme: GrafanaTheme2;
}

export function ThemePreview({ theme }: ThemePreviewProps) {
  return (
    <ThemeContext.Provider value={theme}>
      <ScopedThemeVars theme={theme}>
        <ThemePreviewWithContext />
      </ScopedThemeVars>
    </ThemeContext.Provider>
  );
}

function ThemePreviewWithContext() {
  const theme = useTheme2();
  // A third of the previewed theme's text size, as in a scaled-down screenshot.
  const miniText = styles.miniText(
    Math.round(theme.typography.fontSize / 3),
    Math.round(theme.typography.body.lineHeight / 3)
  );

  return (
    <Box backgroundColor={'canvas'} display={'flex'} direction={'column'} grow={1}>
      <Stack gap={0} direction="column">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          gap={0.5}
          backgroundColor="primary"
          height={3}
          paddingY={0.5}
          paddingX={1}
        >
          <Stack alignItems="center" gap={0.5}>
            <Branding.MenuLogo className={stylex.props(styles.img).className} />
            <div {...stylex.props(styles.breadcrumbs, miniText)}>
              <Trans i18nKey="theme-preview.breadcrumbs.home">Home</Trans>
              <Icon xstyle={styles.breadcrumbSeparator} name="angle-right" />
              <Trans i18nKey="theme-preview.breadcrumbs.dashboards">Dashboards</Trans>
            </div>
          </Stack>
          <Stack alignItems="center" gap={0.5}>
            <div {...stylex.props(styles.formInput)} />
            <Box
              borderStyle="solid"
              borderColor="medium"
              borderRadius="circle"
              height={1}
              width={1}
              backgroundColor="secondary"
              marginLeft={0.5}
            />
          </Stack>
        </Box>
        <Divider spacing={0} />
        <Box padding={2.5} display="flex" direction="column" flex={1}>
          <div {...stylex.props(styles.panel)}>
            <div {...stylex.props(styles.panelHeader, miniText)}>
              <Trans i18nKey="theme-preview.panel.title">Panel</Trans>
            </div>
            <Box padding={0.5} display="flex" direction="column" gap={0.5} grow={1}>
              <div {...stylex.props(styles.formLabel, miniText)}>
                <Trans i18nKey="theme-preview.panel.form-label">Form label</Trans>
              </div>
              <div {...stylex.props(styles.formInput)} />
            </Box>
            <Box display="flex" gap={0.5} padding={1} justifyContent="flex-end">
              <div {...stylex.props(styles.action, styles.actionSecondary)} />
              <div {...stylex.props(styles.action, styles.actionDanger)} />
              <div {...stylex.props(styles.action, styles.actionPrimary)} />
            </Box>
          </div>
        </Box>
      </Stack>
    </Box>
  );
}

const styles = stylex.create({
  miniText: (fontSize: number, lineHeight: number) => ({ fontSize, lineHeight }),
  breadcrumbs: {
    alignItems: 'center',
    color: colors['--gf-colors-text-primary'],
    display: 'flex',
    gap: spacing['--gf-spacing-x0-25'],
    paddingLeft: spacing['--gf-spacing-x0-5'],
  },
  breadcrumbSeparator: {
    height: `calc(${spacing['--gf-spacing-grid-size']} * 0.75)`,
    width: `calc(${spacing['--gf-spacing-grid-size']} * 0.75)`,
  },
  img: {
    height: spacing['--gf-spacing-x1'],
    width: spacing['--gf-spacing-x1'],
  },
  panel: {
    backgroundColor: components['--gf-components-panel-background'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: components['--gf-components-panel-border-color'],
    borderRadius: shape['--gf-shape-radius-default'],
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  panelHeader: {
    alignItems: 'center',
    color: colors['--gf-colors-text-primary'],
    display: 'flex',
    height: spacing['--gf-spacing-x2'],
    paddingTop: spacing['--gf-spacing-x0-5'],
    paddingRight: spacing['--gf-spacing-x0-5'],
    paddingBottom: spacing['--gf-spacing-x0-5'],
    paddingLeft: spacing['--gf-spacing-x0-5'],
  },
  formLabel: {
    color: colors['--gf-colors-text-primary'],
  },
  formInput: {
    backgroundColor: components['--gf-components-input-background'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-medium'],
    borderRadius: shape['--gf-shape-radius-default'],
    height: spacing['--gf-spacing-x1'],
    width: spacing['--gf-spacing-x6'],
  },
  action: {
    borderRadius: shape['--gf-shape-radius-default'],
    height: spacing['--gf-spacing-x1'],
    width: spacing['--gf-spacing-x2-5'],
  },
  actionSecondary: {
    backgroundColor: colors['--gf-colors-secondary-main'],
  },
  actionDanger: {
    backgroundColor: colors['--gf-colors-error-main'],
  },
  actionPrimary: {
    backgroundColor: colors['--gf-colors-primary-main'],
  },
});
