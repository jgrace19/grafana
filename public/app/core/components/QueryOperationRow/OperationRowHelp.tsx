import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { operationRowHelpStyles } from './OperationRowHelp.stylex';
import * as React from 'react';


export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  markdown?: string;
  onRemove?: () => void;
  styleOverrides?: { [key: string]: string };
}

export const OperationRowHelp = React.memo(
  React.forwardRef<HTMLDivElement, Props>(
    ({ className, children, markdown, styleOverrides, onRemove, ...otherProps }, ref) => {
      const styles = ((theme) => getStyles(theme, styleOverrides?.borderTop));

      return (
        <div {...mergeStylexClassName(stylex.props(operationRowHelpStyles.wrapper, className), undefined)} {...otherProps} ref={ref}>
          {markdown && markdownHelper(markdown)}
          {children}
        </div>
      );
    }
  )
);

function markdownHelper(markdown: string) {
  const helpHtml = renderMarkdown(markdown);
  return <div className="markdown-html" dangerouslySetInnerHTML={{ __html: helpHtml }} />;
}

OperationRowHelp.displayName = 'OperationRowHelp';

