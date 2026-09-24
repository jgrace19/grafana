import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const accordianLogsStyles = stylex.create({
  AccordianLogs: {
    label: 'AccordianLogs',
          position: 'relative',
  },
  AccordianLogsHeader: {
    label: 'AccordianLogsHeader',
          color: 'inherit',
          display: 'flex',
          alignItems: 'center',
  },
  AccordianLogsContent: {
    label: 'AccordianLogsContent',
          background: autoColor(theme, '#f0f0f0'),
          padding: '0.5rem 0.5rem 0.25rem 0.5rem',
  },
  AccordianLogsFooter: {
    label: 'AccordianLogsFooter',
          color: autoColor(theme, '#999'),
  },
  AccordianKeyValuesItem: {
    marginBottom: themeSpacing(0.5),
  },
  parenthesis: {
    color: `${autoColor(theme, '#777')}`,
  },
});
