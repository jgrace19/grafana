import clsx from 'clsx';
import * as React from 'react';

import { isUrl } from './utils';

export const renderValue = (value: string): string | React.ReactNode => {
  if (isUrl(value)) {
    return (
      <a href={value} target={'_blank'} className={clsx('external-link')} rel="noreferrer">
        {value}
      </a>
    );
  }

  return value;
};
