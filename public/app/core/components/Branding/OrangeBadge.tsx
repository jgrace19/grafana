import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { orangeBadgeStyles } from './OrangeBadge.stylex';
import { type HTMLAttributes } from 'react';

import { Icon } from '@grafana/ui';

interface Props extends HTMLAttributes<HTMLDivElement> {
  text?: string;
  className?: string;
}

export function OrangeBadge({ text, className, ...htmlProps }: Props) {
  return (
    <div {...mergeStylexClassName(stylex.props(orangeBadgeStyles.wrapper, className), undefined)} {...htmlProps}>
      <Icon name="cloud" size="sm" />
      {text}
    </div>
  );
}

