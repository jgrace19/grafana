import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../../../core/stylex/spacing';

export const influxSQLConfigStyles = stylex.create({
  horizontalField: {
    justifyContent: 'initial',
        margin: `0 ${themeSpacing(0.5)} ${themeSpacing(0.5)} 0`,
  },
});
