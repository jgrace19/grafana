import { mergeStylexClassName } from '@grafana/ui/unstable';
import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';

import { Trans } from '@grafana/i18n';
import { Box, Divider, Icon, Stack } from '@grafana/ui';

import { Branding } from '../Branding/Branding';

interface ThemePreviewProps {
  theme: GrafanaTheme2;
}

export function ThemePreview({ theme }: ThemePreviewProps) {
  return (
    <ThemeContext.Provider value={theme}>
      <ThemePreviewWithContext />
    </ThemeContext.Provider>
  );
}

function ThemePreviewWithContext() {

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
            <Branding.MenuLogo {...stylex.props(themePreviewStyles.img)} />
            <div {...stylex.props(themePreviewStyles.breadcrumbs)}>
              <Trans i18nKey="theme-preview.breadcrumbs.home">Home</Trans>
              <Icon {...stylex.props(themePreviewStyles.breadcrumbSeparator)} name="angle-right" />
              <Trans i18nKey="theme-preview.breadcrumbs.dashboards">Dashboards</Trans>
            </div>
          </Stack>
          <Stack alignItems="center" gap={0.5}>
            <div {...stylex.props(themePreviewStyles.formInput)} />
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
          <div {...stylex.props(themePreviewStyles.panel)}>
            <div {...stylex.props(themePreviewStyles.panelHeader)}>
              <Trans i18nKey="theme-preview.panel.title">Panel</Trans>
            </div>
            <Box padding={0.5} display="flex" direction="column" gap={0.5} grow={1}>
              <div {...stylex.props(themePreviewStyles.formLabel)}>
                <Trans i18nKey="theme-preview.panel.form-label">Form label</Trans>
              </div>
              <div {...stylex.props(themePreviewStyles.formInput)} />
            </Box>
            <Box display="flex" gap={0.5} padding={1} justifyContent="flex-end">
              <div {...mergeStylexClassName(stylex.props(themePreviewStyles.action, themePreviewStyles.actionSecondary), undefined)} />
              <div {...mergeStylexClassName(stylex.props(themePreviewStyles.action, themePreviewStyles.actionDanger), undefined)} />
              <div {...mergeStylexClassName(stylex.props(themePreviewStyles.action, themePreviewStyles.actionPrimary), undefined)} />
            </Box>
          </div>
        </Box>
      </Stack>
    </Box>
  );
}

