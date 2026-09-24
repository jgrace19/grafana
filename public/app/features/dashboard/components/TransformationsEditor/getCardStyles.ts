import * as stylex from '@stylexjs/stylex';

import { type GrafanaTheme2 } from '@grafana/data';
import { mergeStylexClassName } from '@grafana/ui/unstable';

import { getCardStylesStyles } from './getCardStyles.stylex';

/** @deprecated Emotion compat — use getCardStylesStyles with StyleX in new code. */
export const getCardStyles = (_theme: GrafanaTheme2, fullWidth?: boolean) => ({
  baseCard: mergeStylexClassName(
    stylex.props(getCardStylesStyles.baseCard, fullWidth && getCardStylesStyles.baseCardFullWidth),
    undefined
  ).className,
  image: mergeStylexClassName(stylex.props(getCardStylesStyles.image), undefined).className,
  cardDisabled: mergeStylexClassName(stylex.props(getCardStylesStyles.cardDisabled), undefined).className,
  applicableInfoButton: mergeStylexClassName(
    stylex.props(getCardStylesStyles.applicableInfoButton),
    undefined
  ).className,
  tagsWrapper: mergeStylexClassName(stylex.props(getCardStylesStyles.tagsWrapper), undefined).className,
});
