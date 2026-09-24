import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';


import { DynamicTable, type DynamicTableProps } from './DynamicTable';

export type DynamicTableWithGuidelinesProps<T> = Omit<DynamicTableProps<T>, 'renderPrefixHeader, renderPrefixCell'>;

// DynamicTable, but renders visual guidelines on the left, for larger screen widths
export const DynamicTableWithGuidelines = <T extends object>({
  renderExpandedContent,
  ...props
}: DynamicTableWithGuidelinesProps<T>) => {
  return (
    <DynamicTable
      renderExpandedContent={
        renderExpandedContent
          ? (item, index, items) => (
              <>
                {!(index === items.length - 1) && <div {...mergeStylexClassName(stylex.props(formStyles.contentGuideline), stylex.props(formStyles.guideline))} />}
                {renderExpandedContent(item, index, items)}
              </>
            )
          : undefined
      }
      renderPrefixHeader={() => (
        <div {...stylex.props(dynamicTableWithGuidelinesStyles.relative)}>
          <div {...mergeStylexClassName(stylex.props(formStyles.headerGuideline), stylex.props(formStyles.guideline))} />
        </div>
      )}
      renderPrefixCell={(_, index, items) => (
        <div {...stylex.props(dynamicTableWithGuidelinesStyles.relative)}>
          <div {...mergeStylexClassName(stylex.props(formStyles.topGuideline), stylex.props(formStyles.guideline))} />
          {!(index === items.length - 1) && <div {...mergeStylexClassName(stylex.props(formStyles.bottomGuideline), stylex.props(formStyles.guideline))} />}
        </div>
      )}
      {...props}
    />
  );
};

