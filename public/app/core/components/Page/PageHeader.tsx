import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { type NavModelItem } from '@grafana/data';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';

import { PageInfo } from '../PageInfo/PageInfo';

import { EditableTitle } from './EditableTitle';
import { type PageInfoItem } from './types';

import './PageHeader.css';

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
    <div className={`gf-page-header-title ${stylex.props(styles.title).className}`}>
      {navItem.img && <img {...stylex.props(styles.img)} src={navItem.img} alt={`logo for ${navItem.text}`} />}
      {renderTitle ? renderTitle(navItem.text) : <h1>{navItem.text}</h1>}
    </div>
  );

  return (
    <div {...stylex.props(styles.pageHeader)}>
      <div {...stylex.props(styles.topRow)}>
        <div {...stylex.props(styles.titleInfoContainer)}>
          {titleElement}
          {info && <PageInfo info={info} />}
        </div>
        <div {...stylex.props(styles.actions)}>{actions}</div>
      </div>
      {sub && <div {...stylex.props(styles.subTitle)}>{sub}</div>}
    </div>
  );
}

const styles = stylex.create({
  topRow: {
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: spacing['--gf-spacing-x1'],
    columnGap: spacing['--gf-spacing-x3'],
  },
  title: {
    display: 'flex',
    flexDirection: 'row',
    maxWidth: '100%',
    flex: '1',
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
    gap: spacing['--gf-spacing-x1'],
  },
  titleInfoContainer: {
    display: 'flex',
    flex: '1',
    flexWrap: 'wrap',
    rowGap: spacing['--gf-spacing-x1'],
    columnGap: spacing['--gf-spacing-x4'],
    justifyContent: 'space-between',
    maxWidth: '100%',
    minWidth: '200px',
  },
  pageHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing['--gf-spacing-x1'],
    marginBottom: spacing['--gf-spacing-x2'],
  },
  subTitle: {
    position: 'relative',
    color: colors['--gf-colors-text-secondary'],
  },
  img: {
    width: '32px',
    height: '32px',
    marginRight: spacing['--gf-spacing-x2'],
  },
});
