import * as stylex from '@stylexjs/stylex';
import { annotationTooltipHeaderStyles } from './AnnotationTooltipHeader.stylex';

import memoize from 'micro-memoize';
import { useEffect, useRef } from 'react';

import { t } from '@grafana/i18n';
import { IconButton, Stack } from '@grafana/ui';

import { AnnotationAlertState } from './AnnotationAlertState';
import { AnnotationAvatar } from './AnnotationAvatar';
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
  const styles = useStyles2(memoize(getStyles));
  const focusRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (isPinned) {
      focusRef.current?.focus();
    }
  }, [isPinned]);

  return (
    <div className={isCluster ? (annotationTooltipHeaderStyles.clusterWrapper) : styles.wrapper}>
      <div {...stylex.props(annotationTooltipHeaderStyles.header)}>
        <Stack gap={2} basis="100%" justifyContent="space-between" alignItems="center">
          <div {...stylex.props(annotationTooltipHeaderStyles.meta)}>
            {clusterIndex && <span {...stylex.props(annotationTooltipHeaderStyles.clusterIndex)}>{clusterIndex}</span>}
            <span>
              <AnnotationAvatar src={avatarImg} />
              <AnnotationAlertState alertState={alertState} />
            </span>
            <Stack width="100%" basis="100%" justifyContent="space-between" alignItems="center">
              <span {...stylex.props(annotationTooltipHeaderStyles.timeRange)}>{timeRange}</span>
              {clusterLength && <span {...stylex.props(annotationTooltipHeaderStyles.clusterCount)}>{clusterLength}</span>}
            </Stack>
          </div>
          <div {...stylex.props(annotationTooltipHeaderStyles.controls)}>
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
          <span {...stylex.props(annotationTooltipHeaderStyles.subHeader)}>{text}</span>
        </Stack>
      )}
    </div>
  );
}

