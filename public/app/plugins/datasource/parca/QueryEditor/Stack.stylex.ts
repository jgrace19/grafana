import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const stackStyles = stylex.create({
  root: {
    display: 'flex',
        flexDirection: props.direction ?? 'row',
        flexWrap: (props.wrap ?? true) ? 'wrap' : undefined,
        alignItems: props.alignItems,
        gap: themeSpacing(props.gap ?? 2),
        flexGrow: props.flexGrow,
  },
});
