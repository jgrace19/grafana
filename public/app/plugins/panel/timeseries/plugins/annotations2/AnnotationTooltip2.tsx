import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { dateTimeFormat, systemDateFormats, textUtil, type LinkModel, type ActionModel } from '@grafana/data';
import { t } from '@grafana/i18n';
import { Stack, IconButton, Tag, usePanelContext } from '@grafana/ui';
import { mergeStylexProps, VizTooltipFooter } from '@grafana/ui/internal';
import { zIndex } from '@grafana/ui/stylex/constants.stylex';
import { colors, shadows, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';
import alertDef from 'app/features/alerting/state/alertDef';

import './AnnotationTooltip2.css';
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
    avatar = <img {...stylex.props(styles.avatar)} alt="Annotation avatar" src={annoVals.avatarUrl[annoIdx]} />;
  }

  let state: React.ReactNode | null = null;
  let alertText = '';

  if (annoVals.alertId?.[annoIdx] !== undefined && annoVals.newState?.[annoIdx]) {
    const stateModel = alertDef.getStateDisplayModel(annoVals.newState[annoIdx]);
    state = (
      <div {...stylex.props(styles.alertState)}>
        <i className={stateModel.stateClass}>{stateModel.text}</i>
      </div>
    );

    alertText = annoVals.data?.[annoIdx] ? alertDef.getAlertAnnotationText(annoVals.data[annoIdx]) : '';
  } else if (annoVals.title?.[annoIdx]) {
    text = annoVals.title[annoIdx] + (text ? `<br />${text}` : '');
  }

  return (
    <div {...stylex.props(styles.wrapper)}>
      <div {...stylex.props(styles.header)}>
        <Stack gap={2} basis="100%" justifyContent="space-between" alignItems="center">
          <div {...stylex.props(styles.meta)}>
            <span>
              {avatar}
              {state}
            </span>
            {time}
          </div>
          {(canEdit || canDelete || isPinned) && (
            <div {...mergeStylexProps(stylex.props(styles.controls), { className: 'gf-annotation-tooltip-controls' })}>
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

      <div {...mergeStylexProps(stylex.props(styles.body), { className: 'gf-annotation-tooltip-body' })}>
        {text && <div {...stylex.props(styles.text)} dangerouslySetInnerHTML={{ __html: textUtil.sanitize(text) }} />}
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

const styles = stylex.create({
  wrapper: {
    zIndex: zIndex.tooltip,
    whiteSpace: 'initial',
    borderRadius: shape['--gf-shape-radius-default'],
    backgroundColor: colors['--gf-colors-background-elevated'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-weak'],
    boxShadow: shadows['--gf-shadows-z3'],
    userSelect: 'text',
  },
  header: {
    paddingTop: spacing['--gf-spacing-x0-5'],
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x0-5'],
    paddingLeft: spacing['--gf-spacing-x1'],
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors['--gf-colors-border-weak'],
    fontWeight: typography['--gf-typography-font-weight-bold'],
    fontSize: typography['--gf-typography-font-size'],
    color: colors['--gf-colors-text-primary'],
    display: 'flex',
  },
  meta: {
    display: 'flex',
    color: colors['--gf-colors-text-primary'],
    fontWeight: 400,
  },
  controls: {
    display: 'flex',
  },
  body: {
    padding: spacing['--gf-spacing-x1'],
    fontSize: typography['--gf-typography-body-small-font-size'],
    color: colors['--gf-colors-text-secondary'],
    fontWeight: 400,
  },
  text: {
    paddingBottom: spacing['--gf-spacing-x1'],
  },
  avatar: {
    borderRadius: shape['--gf-shape-radius-circle'],
    width: 16,
    height: 16,
    marginRight: spacing['--gf-spacing-x1'],
  },
  alertState: {
    paddingRight: spacing['--gf-spacing-x1'],
    fontWeight: typography['--gf-typography-font-weight-medium'],
  },
});
