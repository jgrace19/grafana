import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { queryLibraryEditingContainerStyles } from './QueryLibraryEditingContainer.stylex';
import { type ReactNode } from 'react';


interface QueryLibraryEditingContainerProps {
  children: ReactNode;
}

export function QueryLibraryEditingContainer({ children }: QueryLibraryEditingContainerProps) {
  return <div {...stylex.props(queryLibraryEditingContainerStyles.container)}>{children}</div>;
}

