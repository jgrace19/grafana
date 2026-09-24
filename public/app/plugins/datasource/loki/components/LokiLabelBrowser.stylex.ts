import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const lokiLabelBrowserStyles = stylex.create({
  wrapper: {
    backgroundColor: grafanaTokens.colors_background_secondary,
        width: '100%',
  },
  wrapperPadding: {
    padding: themeSpacing(2),
  },
  list: {
    marginTop: themeSpacing(1),
        display: 'flex',
        flexWrap: 'wrap',
        maxHeight: '200px',
        overflow: 'auto',
  },
  section: {
    '& + &': {
          margin: themeSpacingShorthand(2, 0),
        },
        position: 'relative',
  },
  footerSectionStyles: {
    padding: themeSpacing(1),
        backgroundColor: grafanaTokens.colors_background_primary,
        position: 'sticky',
        bottom: themeSpacing(-3) /* offset the padding on modal */,
        left: 0,
  },
  selector: {
    fontFamily: grafanaTokens.typography_fontFamilyMonospace,
        marginBottom: themeSpacing(1),
        width: '100%',
  },
  status: {
    marginBottom: themeSpacing(1),
        color: grafanaTokens.colors_text_secondary,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        [theme.transitions.handleMotion('no-preference', 'reduce')]: {
          transition: 'opacity 100ms linear',
        },
        opacity: 0,
        fontSize: grafanaTokens.typography_bodySmall_fontSize,
        height: `calc(${grafanaTokens.typography_bodySmall_fontSize} + 10px)`,
  },
  statusShowing: {
    opacity: 1,
  },
  error: {
    color: grafanaTokens.colors_error_main,
  },
  valueList: {
    marginRight: themeSpacing(1),
        resize: 'horizontal',
  },
  valueListWrapper: {
    borderLeft: `1px solid ${grafanaTokens.colors_border_medium}`,
        margin: themeSpacingShorthand(1, 0),
        padding: themeSpacingShorthand(1, 0, 1, 1),
  },
  valueListArea: {
    display: 'flex',
        flexWrap: 'wrap',
        marginTop: themeSpacing(1),
  },
  valueTitle: {
    marginLeft: themeSpacing(-0.5),
        marginBottom: themeSpacing(1),
  },
  validationStatus: {
    padding: themeSpacing(0.5),
        marginBottom: themeSpacing(1),
        color: grafanaTokens.colors_text_maxContrast,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
  },
});
