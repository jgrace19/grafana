import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const overhaulStylexStyles = stylex.create({
  additionalSettings: {
    marginBottom: '25px',
  },
  secondaryGrey: {
    color: grafanaTokens.colors_secondary_text,
    opacity: '65%',
  },
  inlineError: {
    marginTop: 0,
    marginRight: 0,
    marginBottom: '4px',
    marginLeft: '245px',
  },
  switchField: {
    alignItems: 'center',
  },
  sectionHeaderPadding: {
    paddingTop: '32px',
  },
  sectionBottomPadding: {
    paddingBottom: '28px',
  },
  subsectionText: {
    fontSize: '12px',
  },
  hrBottomSpace: {
    marginBottom: '56px',
  },
  hrTopSpace: {
    marginTop: '50px',
  },
  textUnderline: {
    textDecoration: 'underline',
  },
  versionMargin: {
    marginBottom: '12px',
  },
  advancedHTTPSettingsMargin: {
    marginTop: '24px',
    marginRight: 0,
    marginBottom: '8px',
    marginLeft: 0,
  },
  advancedSettings: {
    paddingTop: '32px',
  },
  alertingTop: {
    marginTop: '40px',
  },
  overhaulPageHeading: {
    fontWeight: 400,
  },
  container: {
    maxWidth: 578,
  },
});
