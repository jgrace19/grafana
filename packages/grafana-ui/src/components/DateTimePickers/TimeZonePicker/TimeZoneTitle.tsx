
import { timeZoneTitleStyleProps } from './TimeZoneTitle.stylex'

import { type ReactNode } from 'react';



interface Props {
  title: string | ReactNode;
}

export const TimeZoneTitle = ({ title }: Props) => {

  if (!title) {
    return null;
  }

  return <span {...timeZoneTitleStyleProps('title')}>{title}</span>;
};

;
