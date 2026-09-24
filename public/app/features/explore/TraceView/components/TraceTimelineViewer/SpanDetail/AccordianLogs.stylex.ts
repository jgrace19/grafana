import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../../../core/stylex/spacing';

export const accordianLogsStyles = stylex.create({
  AccordianLogs: {
          position: 'relative',
  },
  AccordianLogsHeader: {
          color: 'inherit',
          display: 'flex',
          alignItems: 'center',
  },
  AccordianLogsContent: {
          background: '#f0f0f0',
          padding: '0.5rem 0.5rem 0.25rem 0.5rem',
  },
  AccordianLogsFooter: {
          color: '#999',
  },
  AccordianKeyValuesItem: {
    marginBottom: themeSpacing(0.5),
  },
  parenthesis: {
    color: `${'#777'}`,
  },
});
