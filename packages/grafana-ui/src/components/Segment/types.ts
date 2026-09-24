import type { StyleXStyles } from '@stylexjs/stylex';
import { type ReactElement } from 'react';

export interface SegmentProps {
  Component?: ReactElement;
  className?: string;
  /** @internal first-party StyleX overrides for the InlineLabel, applied last */
  xstyle?: StyleXStyles;
  allowCustomValue?: boolean;
  placeholder?: string;
  disabled?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  autofocus?: boolean;
  allowEmptyValue?: boolean;
  inputPlaceholder?: string;
}
