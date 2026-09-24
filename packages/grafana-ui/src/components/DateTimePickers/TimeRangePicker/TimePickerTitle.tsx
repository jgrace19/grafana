
import { timePickerTitleStyleProps } from './TimePickerTitle.stylex'

import { memo, type PropsWithChildren } from 'react';



;

export const TimePickerTitle = memo<PropsWithChildren<{}>>(({ children }) => {

  return <h3 {...timePickerTitleStyleProps('text')}>{children}</h3>;
});

TimePickerTitle.displayName = 'TimePickerTitle';
