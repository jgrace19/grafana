import * as stylex from '@stylexjs/stylex';

import { renderMarkdown } from '@grafana/data';

import { MaybeWrapWithLink } from '../components/MaybeWrapWithLink';
import { type MarkdownCellProps, type TableCellStyles } from '../types';

export function MarkdownCell({ field, rowIdx, disableSanitizeHtml }: MarkdownCellProps) {
  const rawValue = field.values[rowIdx];
  if (rawValue == null) {
    return null;
  }

  const renderValue = field.display!(rawValue);

  return (
    <MaybeWrapWithLink field={field} rowIdx={rowIdx}>
      <div
        className="markdown-container"
        dangerouslySetInnerHTML={{
          __html: renderMarkdown(renderValue.text, { noSanitize: disableSanitizeHtml }).trim(),
        }}
      />
    </MaybeWrapWithLink>
  );
}

// The rules for the rendered markdown are in TableNG.css.
export const getStyles: TableCellStyles = () => ({ xstyle: styles.markdown, className: 'gf-table-ng-markdown' });

const styles = stylex.create({
  markdown: {
    whiteSpace: 'normal',
  },
});
