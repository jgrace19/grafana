
import { mergeStylexClassName } from '../../themes/stylex/mergeClassNames';
import { loadingPlaceholderStyleProps } from './LoadingPlaceholder.stylex'

import { type HTMLAttributes } from 'react';
import * as React from 'react';


import { Spinner } from '../Spinner/Spinner';

/**
 * @public
 */
export interface LoadingPlaceholderProps extends HTMLAttributes<HTMLDivElement> {
  text: React.ReactNode;
}

/**
 * Loading indicator with a text. Used to alert a user to wait for an activity to complete.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/information-loadingplaceholder--docs
 * @public
 */
export const LoadingPlaceholder = ({ text, className, ...rest }: LoadingPlaceholderProps) => {
  return (
    <div {...mergeStylexClassName(loadingPlaceholderStyleProps('container'), className)} {...rest}>
      {text} <Spinner inline={true} />
    </div>
  );
};

;
