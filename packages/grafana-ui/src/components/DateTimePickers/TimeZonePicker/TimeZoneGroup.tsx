
import { timeZoneGroupStyleProps } from './TimeZoneGroup.stylex'

import * as React from 'react';



interface Props {
  label: string | undefined;
  children?: React.ReactNode;
}

export const TimeZoneGroup = (props: Props) => {
  const { children, label } = props;

  if (!label) {
    return <div>{children}</div>;
  }

  return (
    <div>
      <div {...timeZoneGroupStyleProps('header')}>
        <span {...timeZoneGroupStyleProps('label')}>{label}</span>
      </div>
      {children}
    </div>
  );
};

;
