import * as stylex from '@stylexjs/stylex';

import { bp } from '@grafana/ui/stylex/constants.stylex';
import { colors } from '@grafana/ui/stylex/tokens.stylex';

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
                {!(index === items.length - 1) && <div {...stylex.props(styles.guideline, styles.contentGuideline)} />}
                {renderExpandedContent(item, index, items)}
              </>
            )
          : undefined
      }
      renderPrefixHeader={() => (
        <div {...stylex.props(styles.relative)}>
          <div {...stylex.props(styles.guideline, styles.headerGuideline)} />
        </div>
      )}
      renderPrefixCell={(_, index, items) => (
        <div {...stylex.props(styles.relative)}>
          <div {...stylex.props(styles.guideline, styles.topGuideline)} />
          {!(index === items.length - 1) && <div {...stylex.props(styles.guideline, styles.bottomGuideline)} />}
        </div>
      )}
      {...props}
    />
  );
};

const styles = stylex.create({
  // Hidden on small screens, where DynamicTable's grid has no prefix column.
  relative: {
    position: 'relative',
    height: '100%',
    display: { default: null, [bp.smDown]: 'none' },
  },
  guideline: {
    left: '-19px',
    borderLeftWidth: '1px',
    borderLeftStyle: 'solid',
    borderLeftColor: colors['--gf-colors-border-weak'],
    position: 'absolute',
    display: { default: null, [bp.mdDown]: 'none' },
  },
  topGuideline: {
    width: '18px',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors['--gf-colors-border-medium'],
    top: 0,
    bottom: '50%',
  },
  bottomGuideline: {
    top: '50%',
    bottom: 0,
  },
  contentGuideline: {
    top: 0,
    bottom: 0,
    left: '-49px',
  },
  headerGuideline: {
    top: '-17px',
    bottom: 0,
  },
});
