import * as stylex from '@stylexjs/stylex';
import { annotationTooltip2Styles } from './AnnotationTooltip2.stylex';

import * as React from 'react';

import {
  type GrafanaTheme2,
  dateTimeFormat,
  systemDateFormats,
  textUtil,
  type LinkModel,
  type ActionModel,
} from '@grafana/data';
import { t } from '@grafana/i18n';
import { Stack, IconButton, Tag, usePanelContext } from '@grafana/ui';
import { VizTooltipFooter } from '@grafana/ui/internal';
import alertDef from 'app/features/alerting/state/alertDef';

import { AnnotationTooltipHeaderCloseIcon } from './AnnotationTooltipHeaderCloseIcon';

interface Props {
  annoVals: Record<string, any[]>;
  annoIdx: number;
  timeZone: string;
  isPinned: boolean;
  onClose: () => void;
  onEdit: () => void;
  links?: LinkModel[];
  actions?: ActionModel[];
}

const retFalse = () => false;

export const AnnotationTooltip2 = ({
  annoVals,
  annoIdx,
  timeZone,
  isPinned,
  onClose,
  onEdit,
  links = [],
  actions = [],
}: Props) => {
  const annoId = annoVals.id?.[annoIdx];
  const focusRef = React.useRef<HTMLButtonElement | null>(null);
  const { canEditAnnotations = retFalse, canDeleteAnnotations = retFalse, onAnnotationDelete } = usePanelContext();
  const dashboardUID = annoVals.dashboardUID?.[annoIdx];

  // grafana can be configured to load alert rules from loki. Those annotations cannot be edited or deleted. The id being 0 is the best indicator the annotation came from loki
  const canEdit = annoId !== 0 && canEditAnnotations(dashboardUID);
  const canDelete = annoId !== 0 && canDeleteAnnotations(dashboardUID) && onAnnotationDelete != null;

  React.useEffect(() => {
    if (isPinned) {
      focusRef.current?.focus();
    }
  }, [isPinned]);

  const timeFormatter = (value: number) =>
    dateTimeFormat(value, {
      format: systemDateFormats.fullDate,
      timeZone,
    });

  let time = timeFormatter(annoVals.time[annoIdx]);
  let text = annoVals.text?.[annoIdx] ?? '';

  if (annoVals.isRegion?.[annoIdx]) {
    time += ' - ' + timeFormatter(annoVals.timeEnd[annoIdx]);
  }

  let avatar;
  if (annoVals.login?.[annoIdx] && annoVals.avatarUrl?.[annoIdx]) {
    avatar = <img {...stylex.props(annotationTooltip2Styles.avatar)} alt="Annotation avatar" src={annoVals.avatarUrl[annoIdx]} />;
  }

  let state: React.ReactNode | null = null;
  let alertText = '';

  if (annoVals.alertId?.[annoIdx] !== undefined && annoVals.newState?.[annoIdx]) {
    const stateModel = alertDef.getStateDisplayModel(annoVals.newState[annoIdx]);
    state = (
      <div {...stylex.props(annotationTooltip2Styles.alertState)}>
        <i className={stateModel.stateClass}>{stateModel.text}</i>
      </div>
    );

    alertText = annoVals.data?.[annoIdx] ? alertDef.getAlertAnnotationText(annoVals.data[annoIdx]) : '';
  } else if (annoVals.title?.[annoIdx]) {
    text = annoVals.title[annoIdx] + (text ? `<br />${text}` : '');
  }

  return (
    <div {...stylex.props(annotationTooltip2Styles.wrapper)}>
      <div {...stylex.props(annotationTooltip2Styles.header)}>
        <Stack gap={2} basis="100%" justifyContent="space-between" alignItems="center">
          <div {...stylex.props(annotationTooltip2Styles.meta)}>
            <span>
              {avatar}
              {state}
            </span>
            {time}
          </div>
          {(canEdit || canDelete || isPinned) && (
            <div {...stylex.props(annotationTooltip2Styles.controls)}>
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
                  onClick={() => onAnnotationDelete(annoId)}
                  tooltip={t('timeseries.annotation-tooltip2.tooltip-delete', 'Delete')}
                />
              )}
              {isPinned && (
                <AnnotationTooltipHeaderCloseIcon
                  forwardRef={canEdit || canDelete ? null : focusRef}
                  onClick={(e) => {
                    // Don't trigger onClick
                    e.stopPropagation();
                    onClose();
                  }}
                />
              )}
            </div>
          )}
        </Stack>
      </div>

      <div {...stylex.props(annotationTooltip2Styles.body)}>
        {text && <div {...stylex.props(annotationTooltip2Styles.text)} dangerouslySetInnerHTML={{ __html: textUtil.sanitize(text) }} />}
        {alertText}
        <div>
          <Stack gap={0.5} wrap={true}>
            {annoVals.tags?.[annoIdx]?.map((t: string, i: number) => (
              <Tag data-testid={'annotation-tag'} name={t} key={`${t}-${i}`} />
            ))}
          </Stack>
        </div>
      </div>

      {(links.length > 0 || actions.length > 0) && <VizTooltipFooter dataLinks={links} actions={actions} />}
    </div>
  );
};

