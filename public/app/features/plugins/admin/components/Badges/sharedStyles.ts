import * as stylex from '@stylexjs/stylex';

import { type GrafanaTheme2 } from '@grafana/data';
import { mergeStylexClassName } from '@grafana/ui/unstable';

import { badgeSharedStyles } from './sharedStyles.stylex';

/** @deprecated Emotion compat — use badgeSharedStyles with StyleX. */
export const getBadgeColor = (_theme: GrafanaTheme2) =>
  mergeStylexClassName(stylex.props(badgeSharedStyles.badgeColor), undefined).className;
