import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const logLineStyles = stylex.create({
  logLine: {
    color: colors.default,
          display: 'flex',
          gap: themeSpacing(0.5),
          flexDirection: 'row',
          fontFamily: grafanaTokens.typography_fontFamilyMonospace,
          wordBreak: 'break-all',
          ':hover': {
            background: hoverColor,
          },
          '&.infinite-scroll': {
            '&::before': {
              borderTop: `solid 1px ${grafanaTokens.colors_border_strong}`,
              content: '""',
              height: 0,
              left: 0,
              position: 'absolute',
              top: -3,
              width: '100%',
            },
          },
          '& .log-syntax-highlight': {
            '.log-token-string': {
              color: colors.logLineBody,
            },
            '.log-token-duration': {
              color: grafanaTokens.colors_success_text,
            },
            '.log-token-size': {
              color: grafanaTokens.colors_success_text,
            },
            '.log-token-uuid': {
              color: grafanaTokens.colors_success_text,
            },
            '.log-token-key': {
              color: colors.parsedField,
              fontWeight: grafanaTokens.typography_fontWeightMedium,
            },
            '.log-token-json-key': {
              color: colors.parsedField,
              opacity: 0.9,
              fontWeight: grafanaTokens.typography_fontWeightMedium,
            },
            '.log-token-label': {
              color: colors.metadata,
              fontWeight: grafanaTokens.typography_fontWeightBold,
            },
            '.log-token-method': {
              color: grafanaTokens.colors_info_shade,
            },
            '.log-search-match': {
              color: theme.components.textHighlight.text,
              backgroundColor: theme.components.textHighlight.background,
            },
            '&.log-line-body': {
              color: colors.logLineBody,
            },
          },
          '& .no-highlighting': {
            color: grafanaTokens.colors_text_primary,
          },
  },
  matchHighLight: {
    color: theme.components.textHighlight.text,
          backgroundColor: theme.components.textHighlight.background,
  },
  fontSizeSmall: {
    fontSize: grafanaTokens.typography_bodySmall_fontSize,
          lineHeight: grafanaTokens.typography_bodySmall_lineHeight,
  },
  fontSizeDefault: {
    fontSize: grafanaTokens.typography_fontSize,
          lineHeight: grafanaTokens.typography_body_lineHeight,
  },
  detailsDisplayed: {
    background: tinycolor(grafanaTokens.colors_background_canvas)
            .darken(theme.isDark ? 2 : 5)
            .toRgbString(),
  },
  currentLog: {
    background: hoverColor,
          fontWeight: grafanaTokens.typography_fontWeightBold,
  },
  pinnedLogLine: {
    backgroundColor: tinycolor(grafanaTokens.colors_info_transparent).setAlpha(0.25).toString(),
  },
  permalinkedLogLine: {
    backgroundColor: tinycolor(grafanaTokens.colors_info_transparent).setAlpha(0.25).toString(),
  },
  menuIcon: {
    height: virtualization?.getLineHeight() ?? DEFAULT_LINE_HEIGHT,
          margin: 0,
          padding: themeSpacingShorthand(0, 0, 0, 0.5),
  },
  logLineMessage: {
    fontFamily: grafanaTokens.typography_fontFamily,
          justifyContent: 'center',
  },
  timestamp: {
    color: grafanaTokens.colors_text_disabled,
          display: 'inline-block',
  },
  duplicates: {
    flexShrink: 0,
          textAlign: 'center',
          width: themeSpacing(4.5),
  },
  hasError: {
    flexShrink: 0,
          width: themeSpacing(2),
          '& svg': {
            position: 'relative',
            top: -1,
          },
  },
  isSampled: {
    flexShrink: 0,
          width: themeSpacing(2),
          '& svg': {
            position: 'relative',
            top: -1,
          },
  },
  logIconError: {
    color: grafanaTokens.colors_warning_main,
  },
  logIconInfo: {
    color: grafanaTokens.colors_info_main,
  },
  level: {
    color: grafanaTokens.colors_text_secondary,
          fontWeight: grafanaTokens.typography_fontWeightBold,
          textTransform: 'uppercase',
          display: 'inline-block',
          '&.level-critical': {
            color: colors.critical,
          },
          '&.level-error': {
            color: colors.error,
          },
          '&.level-warning': {
            color: colors.warning,
          },
          '&.level-info': {
            color: colors.info,
          },
          '&.level-debug': {
            color: colors.debug,
          },
  },
  loadMoreButton: {
    background: 'transparent',
          border: 'none',
          display: 'inline',
  },
  loadMoreTopContainer: {
    backgroundColor: tinycolor(grafanaTokens.colors_background_primary).setAlpha(0.75).toString(),
          left: 0,
          position: 'absolute',
          top: 0,
          width: '100%',
          zIndex: grafanaTokens.zIndex_navbarFixed,
  },
  overflows: {
    outline: 'solid 1px red',
  },
  clickable: {
    cursor: 'pointer',
  },
  unwrappedLogLine: {
    display: 'grid',
          gridColumnGap: themeSpacing(FIELD_GAP_MULTIPLIER),
          whiteSpace: 'pre',
          paddingBottom: themeSpacing(0.75),
  },
  wrappedLogLine: {
    alignSelf: 'flex-start',
          paddingBottom: themeSpacing(0.75),
          whiteSpace: 'pre-wrap',
          '& .field': {
            marginRight: themeSpacing(FIELD_GAP_MULTIPLIER),
          },
          '& .field:last-child': {
            marginRight: 0,
          },
  },
  fieldsWrapper: {
    minHeight: virtualization ? virtualization.getLineHeight() + virtualization.getPaddingBottom() : undefined,
          ':hover': {
            background: hoverColor,
          },
  },
  collapsedLogLine: {
    overflow: 'hidden',
  },
  expandCollapseControl: {
    display: 'flex',
          justifyContent: 'center',
  },
  expandCollapseControlButton: {
    fontWeight: grafanaTokens.typography_fontWeightLight,
          height: virtualization?.getLineHeight() ?? DEFAULT_LINE_HEIGHT,
          margin: 0,
  },
});
