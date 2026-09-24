import { Global } from '@emotion/react';

import { type GrafanaTheme2 } from '@grafana/data';

import { useTheme2 } from '../ThemeContext';
import { useRootThemeVars } from '../stylex/ThemeVars';

import { getAccessibilityStyles } from './accessibility';
import { getAlertingStyles } from './alerting';
import { getCardStyles } from './card';
import { getCodeStyles } from './code';
import { getDashboardGridStyles } from './dashboardGrid';
import { getDashDiffStyles } from './dashdiff';
import { getElementStyles } from './elements';
import { getExtraStyles } from './extra';
import { getFilterTableStyles } from './filterTable';
import { getFontStyles } from './fonts';
import { getFormElementStyles } from './forms';
import { getHacksStyles } from './hacks';
import { getJsonFormatterStyles } from './jsonFormatter';
import { getLegacySelectStyles } from './legacySelect';
import { getMarkdownStyles } from './markdownStyles';
import { getPageStyles } from './page';
import { getQueryEditorStyles } from './queryEditor';
import { getSkeletonStyles } from './skeletonStyles';
import { getSlateStyles } from './slate';
import { getUplotStyles } from './uPlot';
import { getUtilityClassStyles } from './utilityClasses';

/**
 * Global element styles (in `@layer grafana-global`, below StyleX and unlayered component CSS) plus the
 * theme's `--gf-*` custom properties on `<html>`.
 *
 * @internal
 */
export function GlobalStyles() {
  const theme = useTheme2();
  useRootThemeVars(theme);

  return (
    <Global
      styles={{
        '@layer grafana-global': getGlobalStyles(theme),
      }}
    />
  );
}

function getGlobalStyles(theme: GrafanaTheme2) {
  return [
    getAccessibilityStyles(theme),
    getAlertingStyles(theme),
    getCodeStyles(theme),
    getDashDiffStyles(theme),
    getDashboardGridStyles(theme),
    getElementStyles(theme),
    getExtraStyles(theme),
    getFilterTableStyles(theme),
    getFontStyles(theme),
    getFormElementStyles(theme),
    getJsonFormatterStyles(theme),
    getCardStyles(theme),
    getMarkdownStyles(theme),
    getPageStyles(theme),
    getQueryEditorStyles(theme),
    getSkeletonStyles(theme),
    getSlateStyles(theme),
    getUplotStyles(theme),
    getUtilityClassStyles(theme),
    getLegacySelectStyles(theme),
    getHacksStyles({}),
  ];
}
