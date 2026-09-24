import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { pageHeaderStyles } from './PageHeader.stylex';
import * as React from 'react';

import { type NavModelItem, type GrafanaTheme2 } from '@grafana/data';

import { PageInfo } from '../PageInfo/PageInfo';

import { EditableTitle } from './EditableTitle';
import { type PageInfoItem } from './types';

export interface Props {
  navItem: NavModelItem;
  renderTitle?: (title: string) => React.ReactNode;
  actions?: React.ReactNode;
  info?: PageInfoItem[];
  subTitle?: React.ReactNode;
  onEditTitle?: (newValue: string) => Promise<void>;
}

export function PageHeader({ navItem, renderTitle, actions, info, subTitle, onEditTitle }: Props) {
  const sub = subTitle ?? navItem.subTitle;

  const titleElement = onEditTitle ? (
    <EditableTitle value={navItem.text} onEdit={onEditTitle} />
  ) : (
    <div {...stylex.props(pageHeaderStyles.title)}>
      {navItem.img && <img {...stylex.props(pageHeaderStyles.img)} src={navItem.img} alt={`logo for ${navItem.text}`} />}
      {renderTitle ? renderTitle(navItem.text) : <h1>{navItem.text}</h1>}
    </div>
  );

  return (
    <div {...stylex.props(pageHeaderStyles.pageHeader)}>
      <div {...stylex.props(pageHeaderStyles.topRow)}>
        <div {...stylex.props(pageHeaderStyles.titleInfoContainer)}>
          {titleElement}
          {info && <PageInfo info={info} />}
        </div>
        <div {...stylex.props(pageHeaderStyles.actions)}>{actions}</div>
      </div>
      {sub && <div {...stylex.props(pageHeaderStyles.subTitle)}>{sub}</div>}
    </div>
  );
}

