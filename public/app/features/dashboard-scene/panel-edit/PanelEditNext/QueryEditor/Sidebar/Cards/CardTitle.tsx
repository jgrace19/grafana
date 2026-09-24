import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { cardTitleStyles } from './CardTitle.stylex';


// Text component doesn't let us use strikethrough so we use a span with the correct style instead
export const CardTitle = ({ title, isHidden }: { title: string; isHidden: boolean }) => {

  return (
    <span {...stylex.props(cardTitleStyles.title, isHidden && cardTitleStyles.hidden)}>{title}</span>
  );
};


