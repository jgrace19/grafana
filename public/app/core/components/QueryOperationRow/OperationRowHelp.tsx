import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { renderMarkdown } from '@grafana/data';
import { useTheme2 } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { colors, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  markdown?: string;
  onRemove?: () => void;
  styleOverrides?: { [key: string]: string };
}

export const OperationRowHelp = React.memo(
  React.forwardRef<HTMLDivElement, Props>(
    ({ className, style, children, markdown, styleOverrides, onRemove, ...otherProps }, ref) => {
      const theme = useTheme2();
      // `styleOverrides.borderTop` is a partial border shorthand (e.g. '2px solid') completed with the background colour.
      const borderTop = styleOverrides?.borderTop ? styleOverrides.borderTop + theme.colors.background.secondary : 'none';

      return (
        <div
          {...mergeStylexProps(stylex.props(styles.wrapper), { className, style: { borderTop, ...style } })}
          {...otherProps}
          ref={ref}
        >
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

const styles = stylex.create({
  wrapper: {
    paddingTop: spacing['--gf-spacing-x2'],
    paddingRight: spacing['--gf-spacing-x2'],
    paddingBottom: spacing['--gf-spacing-x2'],
    paddingLeft: spacing['--gf-spacing-x2'],
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-background-secondary'],
    borderTopLeftRadius: 'unset',
    borderTopRightRadius: 'unset',
    borderBottomRightRadius: shape['--gf-shape-radius-default'],
    borderBottomLeftRadius: shape['--gf-shape-radius-default'],
    position: 'relative',
    top: '-4px',
  },
});
