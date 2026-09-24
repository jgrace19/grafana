import * as stylex from '@stylexjs/stylex';

import { mergeStylexClassName } from '@grafana/ui/unstable';

import { logsFieldSelectorWrapperStylesX } from './styles.stylex';

const cn = (key: keyof typeof logsFieldSelectorWrapperStylesX) =>
  mergeStylexClassName(stylex.props(logsFieldSelectorWrapperStylesX[key]), undefined).className ?? '';

export const logsFieldSelectorWrapperStyles = {
  collapsedButtonContainer: cn('collapsedButtonContainer'),
  collapsedButton: cn('collapsedButton'),
};
