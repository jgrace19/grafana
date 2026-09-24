import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { detailsFieldStyles } from './DetailsField.stylex';
import * as React from 'react';


interface Props {
  label: React.ReactNode;
  className?: string;
  horizontal?: boolean;
  childrenWrapperClassName?: string;
}

export const DetailsField = ({
  className,
  label,
  horizontal,
  children,
  childrenWrapperClassName,
}: React.PropsWithChildren<Props>) => {

  return (
    <div className={cx(detailsFieldStyles.field, horizontal ? detailsFieldStyles.fieldHorizontal : detailsFieldStyles.fieldVertical, className)}>
      <div>{label}</div>
      <div className={childrenWrapperClassName}>{children}</div>
    </div>
  );
};

