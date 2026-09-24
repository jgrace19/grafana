import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { pageInfoStyles } from './PageInfo.stylex';
import { Fragment } from 'react';


import { type PageInfoItem } from '../Page/types';

export interface Props {
  info: PageInfoItem[];
}

export function PageInfo({ info }: Props) {

  return (
    <div {...stylex.props(pageInfoStyles.container)}>
      {info.map((infoItem, index) => (
        <Fragment key={index}>
          <div {...stylex.props(pageInfoStyles.infoItem)}>
            <div {...stylex.props(pageInfoStyles.label)}>{infoItem.label}</div>
            {infoItem.value}
          </div>
          {index + 1 < info.length && <div data-testid="page-info-separator" {...stylex.props(pageInfoStyles.separator)} />}
        </Fragment>
      ))}
    </div>
  );
}

