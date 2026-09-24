import * as stylex from '@stylexjs/stylex';
import { type ReactNode, useMemo } from 'react';

import { type Field, fieldReducers, ReducerID } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';
import { type TableFooterOptions } from '@grafana/schema';

import { useTheme2 } from '../../../../themes/ThemeContext';
import { colors, spacing, typography } from '../../../../themes/stylex/tokens.stylex';
import { useReducerEntries } from '../hooks';
import { getDefaultCellStyles } from '../styles';
import { type TableRow } from '../types';
import { getDisplayName, type TextAlign } from '../utils';

interface SummaryCellProps {
  rows: TableRow[];
  field: Field;
  footers: Array<TableFooterOptions | undefined>;
  textAlign: TextAlign;
  colIdx: number;
  rowLabel?: boolean;
  hideLabel?: boolean;
}

const getReducerName = (reducerId: string): string => {
  if (reducerId === ReducerID.countAll) {
    return t('grafana-ui.table.footer.reducer.count', 'Count');
  }
  return fieldReducers.get(reducerId)?.name || reducerId;
};

export const SummaryCell = ({
  rows,
  footers,
  field,
  colIdx,
  hideLabel = false,
  rowLabel = false,
  textAlign,
}: SummaryCellProps) => {
  const theme = useTheme2();
  const defaultFooterCellStyles = getDefaultCellStyles(theme, {
    textAlign: 'left', // alignment is set in footerItem
    shouldOverflow: true,
    textWrap: false,
  });
  const displayName = getDisplayName(field);
  const reducerResultsEntries = useReducerEntries(field, rows, displayName, colIdx);
  const firstFooterReducers = useMemo(() => {
    for (const footer of footers) {
      if (footer?.reducers?.length ?? 0 > 0) {
        return footer!.reducers!;
      }
    }
    return;
  }, [footers]);
  const renderRowLabel = rowLabel && reducerResultsEntries.length === 0 && Boolean(firstFooterReducers);

  const SummaryCellItem = ({ children }: { children: ReactNode }) => (
    <div {...stylex.props(styles.footerItem, hideLabel ? justifyContentStyles[textAlign] : styles.spaceBetween)}>
      {children}
    </div>
  );
  const SummaryCellLabel = ({ children }: { children: ReactNode }) => (
    <div
      data-testid={selectors.components.Panels.Visualization.TableNG.Footer.ReducerLabel}
      {...stylex.props(styles.footerItemLabel)}
    >
      {children}
    </div>
  );
  const SummaryCellValue = ({ children }: { children: ReactNode }) => (
    <div
      data-testid={selectors.components.Panels.Visualization.TableNG.Footer.Value}
      {...stylex.props(styles.footerItemValue)}
    >
      {children}
    </div>
  );

  // Render each reducer in the footer
  return (
    <div
      {...stylex.props(defaultFooterCellStyles, styles.footerCell)}
      data-testid={reducerResultsEntries.length === 0 && !renderRowLabel ? 'summary-cell-empty' : undefined}
    >
      {reducerResultsEntries.map(([reducerId, reducerResult]) => {
        // empty reducer entry, but there may be more after - render a spacer.
        if (reducerResult === null) {
          return (
            <SummaryCellItem key={reducerId}>
              {rowLabel ? <SummaryCellLabel>{getReducerName(reducerId)}</SummaryCellLabel> : <>&nbsp;</>}
            </SummaryCellItem>
          );
        }

        return (
          <SummaryCellItem key={reducerId}>
            {!hideLabel && <SummaryCellLabel>{getReducerName(reducerId)}</SummaryCellLabel>}
            <SummaryCellValue>{reducerResult}</SummaryCellValue>
          </SummaryCellItem>
        );
      })}

      {renderRowLabel &&
        firstFooterReducers!.map((reducerId) => (
          <SummaryCellItem key={reducerId}>
            <SummaryCellLabel>{getReducerName(reducerId)}</SummaryCellLabel>
          </SummaryCellItem>
        ))}
    </div>
  );
};

const styles = stylex.create({
  footerCell: {
    flexDirection: 'column',
    minHeight: '100%',
    width: '100%',
  },
  footerItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
    gap: spacing['--gf-spacing-x0-5'],
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  footerItemLabel: {
    flexShrink: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    color: colors['--gf-colors-text-secondary'],
    fontSize: typography['--gf-typography-body-small-font-size'],
    fontWeight: typography['--gf-typography-font-weight-light'],
    textTransform: 'uppercase',
    lineHeight: '22px',
  },
  footerItemValue: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontWeight: typography['--gf-typography-font-weight-medium'],
  },
});

const justifyContentStyles = stylex.create({
  left: { justifyContent: 'flex-start' },
  right: { justifyContent: 'flex-end' },
  center: { justifyContent: 'center' },
});
