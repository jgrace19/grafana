import * as stylex from '@stylexjs/stylex';
import { type ReactNode, useEffect } from 'react';
import { useToggle } from 'react-use';

import { t } from '@grafana/i18n';
import { IconButton, Stack, useTheme2 } from '@grafana/ui';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';

import { Spacer } from '../../components/Spacer';
import { useWorkbenchContext } from '../WorkbenchContext';

// Width of the md IconButton used as the expand/collapse chevron, in pixels.
const CHEVRON_WIDTH_PX = 24;

interface GenericRowProps {
  width: number;
  title: ReactNode;
  metadata?: ReactNode;
  actions?: ReactNode;
  content?: ReactNode;
  isOpenByDefault?: boolean;
  children?: ReactNode;
  // allow overriding / adding styles for the left column of the row
  leftColumnXstyle?: stylex.StyleXStyles;
  depth?: number; // for indentation of nested rows
  showIndentBorder?: boolean; // draw a left border when depth > 0 (leaf rows only)
  /**
   * When false, expand-all signals from WorkbenchContext are ignored.
   * Use this for rows whose children should not be auto-expanded (e.g. AlertRuleRow instance list).
   */
  expandable?: boolean;
}

export const GenericRow = ({
  width,
  title,
  metadata,
  actions,
  content,
  isOpenByDefault = false,
  children,
  leftColumnXstyle,
  depth = 0,
  showIndentBorder = false,
  expandable = true,
}: GenericRowProps) => {
  const theme = useTheme2();
  const { expandGeneration, collapseGeneration } = useWorkbenchContext();

  const hasChildren = Boolean(children);

  // Compute the effective initial state: honour expand/collapse signals that were
  // already active when this row mounted (e.g. a parent just opened revealing us).
  const effectiveInitialOpen = (() => {
    if (collapseGeneration > 0) {
      return false;
    }
    if (expandGeneration > 0 && expandable) {
      return true;
    }
    return isOpenByDefault;
  })();

  const [isOpen, handleToggle] = useToggle(effectiveInitialOpen);

  // Respond to expand-all / collapse-all signals for already-mounted rows.
  useEffect(() => {
    if (expandGeneration > 0 && expandable && hasChildren && !isOpen) {
      handleToggle(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expandGeneration]);

  useEffect(() => {
    if (collapseGeneration > 0 && hasChildren && isOpen) {
      handleToggle(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collapseGeneration]);

  const showChildContent = isOpen && hasChildren;

  const offsetPx = depth > 0 ? depth * 2 * theme.spacing.gridSize + (showIndentBorder ? theme.spacing.gridSize : 0) : 0;

  return (
    <>
      <div
        {...stylex.props(
          styles.groupItemWrapper(`${Math.max(0, width - offsetPx)}px auto`),
          depth > 0 && styles.indented(`calc(${spacing['--gf-spacing-grid-size']} * ${depth * 2})`),
          depth > 0 && showIndentBorder && styles.indentBorder
        )}
      >
        <div {...stylex.props(styles.leftColumn, styles.column, leftColumnXstyle)}>
          <div {...stylex.props(styles.columnContent)}>
            <LeftCell
              title={title}
              metadata={metadata}
              actions={actions}
              isOpen={isOpen}
              onToggle={hasChildren ? handleToggle : undefined}
            />
          </div>
        </div>
        <div {...stylex.props(styles.rightColumnWrapper, styles.column)}>
          {content && <div {...stylex.props(styles.columnContent)}>{content}</div>}
        </div>
      </div>
      {showChildContent ? children : null}
    </>
  );
};

interface LeftCellProps {
  title: ReactNode;
  metadata?: ReactNode;
  actions?: ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
}

const LeftCell = ({ title, metadata = null, actions = null, isOpen = true, onToggle }: LeftCellProps) => {
  return (
    <Stack direction="row" alignItems="center" gap={0.5}>
      {onToggle ? (
        <IconButton
          name={isOpen ? 'angle-down' : 'angle-right'}
          onClick={onToggle}
          xstyle={styles.toggle}
          variant="secondary"
          size="md"
          aria-label={t('alerting.group-wrapper.toggle', 'Toggle group')}
        />
      ) : (
        <div {...stylex.props(styles.chevronPlaceholder)} />
      )}
      <Stack direction="column" alignItems="flex-start" gap={0} flex={1}>
        <Stack direction="row" alignItems="center" gap={1} width="100%">
          {title}
          {actions && <Spacer />}
          {actions}
        </Stack>
        {metadata}
      </Stack>
    </Stack>
  );
};

const styles = stylex.create({
  toggle: {
    alignSelf: 'flex-start',
    marginTop: spacing['--gf-spacing-x0-5'],
  },
  column: {
    display: 'flex',
    position: 'relative',
    flexBasis: 0,
  },
  leftColumn: {
    overflow: 'hidden',
  },
  rightColumnWrapper: {
    minWidth: 'min-content',
    flexGrow: 1,
  },
  columnContent: {
    padding: 5,
    width: '100%',
  },
  groupItemWrapper: (gridTemplateColumns: string) => ({
    display: 'grid',
    gridTemplateColumns,
    gap: spacing['--gf-spacing-x2'],
  }),
  indented: (marginLeft: string) => ({
    marginLeft,
  }),
  indentBorder: {
    borderLeftWidth: '1px',
    borderLeftStyle: 'solid',
    borderLeftColor: colors['--gf-colors-border-weak'],
    paddingLeft: spacing['--gf-spacing-x1'],
  },
  chevronPlaceholder: {
    width: CHEVRON_WIDTH_PX,
    flexShrink: 0,
  },
});
