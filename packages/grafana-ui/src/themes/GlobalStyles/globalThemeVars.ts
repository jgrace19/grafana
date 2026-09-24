import { type GrafanaTheme2 } from '@grafana/data';

export type GlobalThemeVarName = `--gf-global-${string}`;

/**
 * Theme values that global and shared stylesheets need but that aren't `--gf-*` tokens: color math and
 * `theme.isDark` branches, computed from the theme exactly as the Emotion styles did.
 */
export function getGlobalThemeVars(theme: GrafanaTheme2): Record<GlobalThemeVarName, string> {
  const { colors, isDark } = theme;
  const { palette } = theme.v1;

  return {
    '--gf-global-color-scheme': colors.mode,
    '--gf-global-text-warning-hover': colors.emphasize(colors.warning.text, 0.15),
    '--gf-global-text-error-hover': colors.emphasize(colors.error.text, 0.15),
    '--gf-global-text-success-hover': colors.emphasize(colors.success.text, 0.15),
    '--gf-global-secondary-hover-background': colors.emphasize(colors.background.secondary, 0.03),
    '--gf-global-selectable-hover-background': colors.emphasize(colors.background.canvas, 0.08),
    '--gf-global-filter-table-odd-row-background': colors.emphasize(colors.background.primary, 0.02),
    '--gf-global-filter-table-hover-row-background': colors.emphasize(colors.background.primary, 0.05),
    '--gf-global-resize-handle-color': isDark ? palette.gray1 : palette.gray3,
    '--gf-global-diff-json-new-background': isDark ? '#457740' : '#664e33',
    '--gf-global-diff-json-old-background': isDark ? '#a04338' : '#5a372a',
    '--gf-global-json-string': isDark ? '#23d662' : 'green',
    '--gf-global-json-number': isDark ? colors.primary.text : colors.primary.main,
    '--gf-global-json-boolean': isDark ? colors.primary.text : colors.error.main,
    '--gf-global-json-null': isDark ? '#eec97d' : '#855a00',
    '--gf-global-json-undefined': isDark ? 'rgb(239, 143, 190)' : 'rgb(202, 11, 105)',
    '--gf-global-json-function': isDark ? '#fd48cb' : '#ff20ed',
    '--gf-global-json-url': isDark ? '#027bff' : colors.primary.main,
    '--gf-global-json-bracket': isDark ? '#9494ff' : colors.primary.main,
    '--gf-global-json-key': isDark ? '#23a0db' : '#00008b',
    '--gf-global-typeahead-selected-background': isDark ? palette.dark9 : palette.gray6,
    '--gf-global-btn-inverse-start': isDark ? palette.dark6 : palette.gray5,
    '--gf-global-btn-inverse-end': isDark ? palette.dark5 : palette.gray4,
    '--gf-global-drag-handle-grip-color': colors.emphasize(colors.background.secondary, 0.15),
  };
}
