import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { tagBadgeStyles } from './TagBadge.stylex';
import * as React from 'react';

import { getTagColorsFromName, Icon } from '@grafana/ui';

export interface Props {
  label: string;
  removeIcon: boolean;
  count: number;
  onClick?: React.MouseEventHandler<SVGElement>;
}

export const TagBadge = ({ count, label, onClick, removeIcon }: Props) => {
  const { color } = getTagColorsFromName(label);

  const countLabel = count !== 0 && <span style={{ marginLeft: '3px' }}>{`(${count})`}</span>;

  return (
    <span
      {...stylex.props(tagBadgeStyles.badge)}
      style={{
        backgroundColor: color,
      }}
    >
      {removeIcon && <Icon onClick={onClick} name="times" />}
      {label} {countLabel}
    </span>
  );
};

export 