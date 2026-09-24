import * as stylex from '@stylexjs/stylex';
import { useRef, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { useAsyncFn, useClickAway } from 'react-use';

import { type AnnotationEventUIModel, dateTimeFormat, systemDateFormats } from '@grafana/data';
import { Trans, t } from '@grafana/i18n';
import { Button, Field, Stack, TextArea, usePanelContext } from '@grafana/ui';
import { colors, shadows, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';
import { Form } from 'app/core/components/Form/Form';
import { TagFilter } from 'app/core/components/TagFilter/TagFilter';
import { annotationServer } from 'app/features/annotations/api';

import './AnnotationEditor2.css';
import { AnnotationTooltipHeaderCloseIcon } from './AnnotationTooltipHeaderCloseIcon';

interface Props {
  annoVals: Record<string, any[]>;
  annoIdx: number;
  timeZone: string;
  dismiss: () => void;
}

interface AnnotationEditFormDTO {
  description: string;
  tags: string[];
}

export const AnnotationEditor2 = ({ annoVals, annoIdx, dismiss, timeZone, ...otherProps }: Props) => {
  const { onAnnotationCreate, onAnnotationUpdate } = usePanelContext();
  const focusRef = useRef<HTMLButtonElement | null>(null);
  const clickAwayRef = useRef(null);

  useClickAway(clickAwayRef, dismiss);

  // focus text area on render
  useEffect(() => {
    focusRef.current?.focus();
  }, []);

  const [createAnnotationState, createAnnotation] = useAsyncFn(async (event: AnnotationEventUIModel) => {
    const result = await onAnnotationCreate!(event);
    dismiss();
    return result;
  });

  const [updateAnnotationState, updateAnnotation] = useAsyncFn(async (event: AnnotationEventUIModel) => {
    const result = await onAnnotationUpdate!(event);
    dismiss();
    return result;
  });

  const timeFormatter = (value: number) =>
    dateTimeFormat(value, {
      format: systemDateFormats.fullDate,
      timeZone,
    });

  const isUpdatingAnnotation = annoVals.id?.[annoIdx] != null;
  const isRegionAnnotation = annoVals.isRegion?.[annoIdx];
  const operation = isUpdatingAnnotation ? updateAnnotation : createAnnotation;
  const stateIndicator = isUpdatingAnnotation ? updateAnnotationState : createAnnotationState;
  const time = isRegionAnnotation
    ? `${timeFormatter(annoVals.time[annoIdx])} - ${timeFormatter(annoVals.timeEnd[annoIdx])}`
    : timeFormatter(annoVals.time[annoIdx]);

  const onSubmit = ({ tags, description }: AnnotationEditFormDTO) => {
    operation({
      id: annoVals.id?.[annoIdx] ?? undefined,
      tags,
      description,
      from: Math.round(annoVals.time[annoIdx]!),
      to: Math.round(annoVals.timeEnd?.[annoIdx] ?? annoVals.time[annoIdx]!),
    });
  };

  // Annotation editor
  return (
    <div ref={clickAwayRef} {...stylex.props(styles.editor)} {...otherProps}>
      <div {...stylex.props(styles.header)}>
        <Stack justifyContent={'space-between'} alignItems={'center'}>
          <Stack gap={0} width="100%" justifyContent={'space-between'} alignItems={'center'}>
            <div>
              {isUpdatingAnnotation
                ? t('timeseries.annotation-editor2.edit-annotation', 'Edit annotation')
                : t('timeseries.annotation-editor2.add-annotation', 'Add annotation')}
            </div>
            <div>{time}</div>
          </Stack>
          <AnnotationTooltipHeaderCloseIcon
            forwardRef={focusRef}
            onClick={(e) => {
              // Don't trigger onClick
              e.stopPropagation();
              dismiss();
            }}
          />
        </Stack>
      </div>
      <Form<AnnotationEditFormDTO>
        onSubmit={onSubmit}
        defaultValues={{ description: annoVals.text?.[annoIdx], tags: annoVals.tags?.[annoIdx] || [] }}
      >
        {({ register, errors, control }) => {
          return (
            <>
              <div {...stylex.props(styles.content)}>
                <Field
                  label={t('timeseries.annotation-editor2.label-description', 'Description')}
                  invalid={!!errors.description}
                  error={errors?.description?.message}
                >
                  <TextArea
                    data-testid={'annotation-editor-description'}
                    className="gf-annotation-editor-textarea"
                    {...register('description', {
                      required: 'Annotation description is required',
                    })}
                  />
                </Field>
                <Field label={t('timeseries.annotation-editor2.label-tags', 'Tags')}>
                  <Controller
                    control={control}
                    name="tags"
                    render={({ field: { ref, onChange, ...field } }) => {
                      return (
                        <TagFilter
                          allowCustomValue
                          placeholder={t('timeseries.annotation-editor2.placeholder-add-tags', 'Add tags')}
                          onChange={onChange}
                          tagOptions={annotationServer().tags}
                          tags={field.value}
                        />
                      );
                    }}
                  />
                </Field>
              </div>
              <div {...stylex.props(styles.footer)}>
                <Stack justifyContent={'flex-end'}>
                  <Button size={'sm'} variant="secondary" onClick={dismiss} fill="outline">
                    <Trans i18nKey="timeseries.annotation-editor2.cancel">Cancel</Trans>
                  </Button>
                  <Button size={'sm'} type={'submit'} disabled={stateIndicator?.loading}>
                    {stateIndicator?.loading
                      ? t('timeseries.annotation-editor2.saving', 'Saving')
                      : t('timeseries.annotation-editor2.save', 'Save')}
                  </Button>
                </Stack>
              </div>
            </>
          );
        }}
      </Form>
    </div>
  );
};

const styles = stylex.create({
  editor: {
    backgroundColor: colors['--gf-colors-background-elevated'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-weak'],
    borderRadius: shape['--gf-shape-radius-default'],
    boxShadow: shadows['--gf-shadows-z3'],
    userSelect: 'text',
    width: '460px',
  },
  content: {
    padding: spacing['--gf-spacing-x1'],
  },
  header: {
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors['--gf-colors-border-weak'],
    paddingTop: spacing['--gf-spacing-x0-5'],
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x0-5'],
    paddingLeft: spacing['--gf-spacing-x1'],
    fontWeight: typography['--gf-typography-font-weight-bold'],
    fontSize: typography['--gf-typography-font-size'],
    color: colors['--gf-colors-text-primary'],
  },
  footer: {
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: colors['--gf-colors-border-weak'],
    padding: spacing['--gf-spacing-x1'],
  },
});
