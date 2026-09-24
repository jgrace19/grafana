import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../core/stylex/spacing';

export const unifiedAlertListStyles = stylex.create({
  cardContainer: {
    padding: themeSpacingShorthand(0.5, 0, 0.25, 0),
        lineHeight: grafanaTokens.typography_body_lineHeight,
        marginBottom: 0,
  },
  alertRuleList: {
    display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        listStyleType: 'none',
  },
  alertRuleItem: {
    display: 'flex',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        background: grafanaTokens.colors_background_secondary,
        padding: themeSpacingShorthand(0.5, 1),
        borderRadius: grafanaTokens.shape_radius_default,
        marginBottom: themeSpacing(0.5),
        gap: themeSpacing(2),
  },
  alertName: {
    fontSize: grafanaTokens.typography_h6_fontSize,
        fontWeight: grafanaTokens.typography_fontWeightBold,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
  },
  alertNameWrapper: {
    display: 'flex',
        flex: 1,
        flexWrap: 'nowrap',
        flexDirection: 'column',
        minWidth: '100px',
  },
  alertLabels: {
    '> *': {
          marginRight: themeSpacing(0.5),
        },
  },
  alertDuration: {
    fontSize: grafanaTokens.typography_bodySmall_fontSize,
  },
  alertRuleItemText: {
    fontWeight: grafanaTokens.typography_fontWeightBold,
        fontSize: grafanaTokens.typography_bodySmall_fontSize,
        margin: 0,
  },
  alertRuleItemTime: {
    color: grafanaTokens.colors_text_secondary,
        fontWeight: 'normal',
        whiteSpace: 'nowrap',
  },
  alertRuleItemInfo: {
    fontWeight: 'normal',
        flexGrow: 2,
        display: 'flex',
        alignItems: 'flex-end',
  },
  noAlertsMessage: {
    display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
  },
  alertIcon: {
    marginRight: themeSpacing(0.5),
  },
  instanceDetails: {
    minWidth: '1px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
  },
  customGroupDetails: {
    marginBottom: themeSpacing(0.5),
  },
  link: {
    wordBreak: 'break-all',
        color: grafanaTokens.colors_primary_text,
        display: 'flex',
        alignItems: 'center',
        gap: themeSpacing(1),
  },
  hidden: {
    display: 'none',
  },
  statLink: {
    display: 'block',
        width: '100%',
        height: '100%',
        textDecoration: 'none',
        ':hover': {
          textDecoration: 'none',
        },
  },
});
