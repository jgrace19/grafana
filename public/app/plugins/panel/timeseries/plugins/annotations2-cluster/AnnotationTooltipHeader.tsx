import * as stylex from '@stylexjs/stylex';
import { useEffect, useRef } from 'react';

import { t } from '@grafana/i18n';
import { IconButton, Stack } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { colors, shadows, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

import { AnnotationAlertState } from './AnnotationAlertState';
import { AnnotationAvatar } from './AnnotationAvatar';
import './AnnotationTooltipHeader.css';
import { AnnotationTooltipHeaderCloseIcon } from './AnnotationTooltipHeaderCloseIcon';

export function AnnotationTooltipHeader({
  clusterLength,
  clusterIndex,
  text,
  avatarImg,
  alertState,
  timeRange,
  canEdit,
  canDelete,
  isPinned,
  onEdit,
  onDelete,
  onRemove,
  isCluster = false,
}: {
  clusterLength?: string;
  clusterIndex?: number;
  text?: string;
  avatarImg?: string | undefined;
  alertState?: string | undefined;
  timeRange: string;
  canEdit: false | boolean;
  canDelete: boolean;
  isPinned: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onRemove?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isCluster?: boolean;
}) {
  const focusRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (isPinned) {
      focusRef.current?.focus();
    }
  }, [isPinned]);

  return (
    <div {...stylex.props(isCluster ? styles.clusterWrapper : styles.wrapper)}>
      <div {...stylex.props(styles.header)}>
        <Stack gap={2} basis="100%" justifyContent="space-between" alignItems="center">
          <div {...stylex.props(styles.meta)}>
            {clusterIndex && <span {...stylex.props(styles.clusterIndex)}>{clusterIndex}</span>}
            <span>
              <AnnotationAvatar src={avatarImg} />
              <AnnotationAlertState alertState={alertState} />
            </span>
            <Stack width="100%" basis="100%" justifyContent="space-between" alignItems="center">
              <span {...stylex.props(styles.timeRange)}>{timeRange}</span>
              {clusterLength && <span {...stylex.props(styles.clusterCount)}>{clusterLength}</span>}
            </Stack>
          </div>
          <div {...mergeStylexProps(stylex.props(styles.controls), { className: 'gf-annotation-tooltip-controls' })}>
            {(canEdit || canDelete || isPinned) && (
              <>
                {canEdit && (
                  <IconButton
                    ref={focusRef}
                    name={'pen'}
                    size={'sm'}
                    onClick={onEdit}
                    tooltip={t('timeseries.annotation-tooltip2.tooltip-edit', 'Edit')}
                  />
                )}
                {canDelete && (
                  <IconButton
                    ref={canEdit ? null : focusRef}
                    name={'trash-alt'}
                    size={'sm'}
                    onClick={onDelete}
                    tooltip={t('timeseries.annotation-tooltip2.tooltip-delete', 'Delete')}
                  />
                )}
                {onRemove && isPinned && (
                  <AnnotationTooltipHeaderCloseIcon
                    onClick={onRemove}
                    forwardRef={canEdit || canDelete ? null : focusRef}
                  />
                )}
              </>
            )}
          </div>
        </Stack>
      </div>
      {text && (
        <Stack gap={2} basis="100%" alignItems="center">
          <span {...stylex.props(styles.subHeader)}>{text}</span>
        </Stack>
      )}
    </div>
  );
}

const styles = stylex.create({
  wrapper: {
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors['--gf-colors-border-weak'],
  },
  subHeader: {
    fontSize: typography['--gf-typography-body-small-font-size'],
    paddingTop: spacing['--gf-spacing-x0'],
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x0'],
    paddingLeft: spacing['--gf-spacing-x1'],
  },
  clusterIndex: {
    fontWeight: typography['--gf-typography-font-weight-bold'],
    marginRight: spacing['--gf-spacing-x1'],
  },
  clusterCount: {
    fontSize: typography['--gf-typography-body-small-font-size'],
  },
  timeRange: {
    fontFamily: typography['--gf-typography-font-family-monospace'],
  },
  clusterWrapper: {
    backgroundColor: colors['--gf-colors-background-elevated'],
    position: 'sticky',
    top: 0,
    left: 0,
    zIndex: 1,
    boxShadow: shadows['--gf-shadows-z1'],
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors['--gf-colors-border-weak'],
  },
  header: {
    paddingTop: spacing['--gf-spacing-x0-5'],
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x0-5'],
    paddingLeft: spacing['--gf-spacing-x1'],
    fontWeight: typography['--gf-typography-font-weight-bold'],
    fontSize: typography['--gf-typography-font-size'],
    color: colors['--gf-colors-text-primary'],
    display: 'flex',
  },
  meta: {
    width: '100%',
    display: 'flex',
    whiteSpace: 'nowrap',
    color: colors['--gf-colors-text-primary'],
    fontWeight: 400,
  },
  controls: {
    // space for all three icons
    minWidth: '54px',
    justifyContent: 'flex-end',
    display: 'flex',
  },
});
