import * as stylex from '@stylexjs/stylex';
import { annotationEditor2Styles } from './AnnotationEditor2.stylex';

import { useRef, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { useAsyncFn, useClickAway } from 'react-use';

import { type AnnotationEventUIModel, type GrafanaTheme2, dateTimeFormat, systemDateFormats } from '@grafana/data';
import { Trans, t } from '@grafana/i18n';
import { Button, Field, Stack, TextArea, usePanelContext } from '@grafana/ui';
import { Form } from 'app/core/components/Form/Form';
import { TagFilter } from 'app/core/components/TagFilter/TagFilter';
import { annotationServer } from 'app/features/annotations/api';

import { AnnotationTooltipHeaderCloseIcon } from './AnnotationTooltipHeaderCloseIcon';
import { type AnnotationVals } from './types';

interface Props {
  annoVals: AnnotationVals;
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
  const timeEnd = annoVals.timeEnd?.[annoIdx];
  const timeVal = annoVals.time[annoIdx];
  const time =
    isRegionAnnotation && timeEnd != null
      ? `${timeFormatter(timeVal)} - ${timeFormatter(timeEnd)}`
      : timeFormatter(timeVal);

  const onSubmit = ({ tags, description }: AnnotationEditFormDTO) => {
    operation({
      // @ts-expect-error @todo https://github.com/grafana/grafana/issues/120097 - id is typed incorrectly as string but breaks annotation API
      id: annoVals.id?.[annoIdx] ?? undefined,
      tags,
      description,
      from: Math.round(annoVals.time[annoIdx]!),
      to: Math.round(annoVals.timeEnd?.[annoIdx] ?? annoVals.time[annoIdx]!),
    });
  };

  // Annotation editor
  return (
    <div ref={clickAwayRef} {...stylex.props(annotationEditor2Styles.editor)} {...otherProps}>
      <div {...stylex.props(annotationEditor2Styles.header)}>
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
        defaultValues={{ description: annoVals.text?.[annoIdx] ?? '', tags: annoVals.tags?.[annoIdx] || [] }}
      >
        {({ register, errors, control }) => {
          return (
            <>
              <div {...stylex.props(annotationEditor2Styles.content)}>
                <Field
                  htmlFor={'annotation-description-textarea'}
                  autoFocus={true}
                  label={t('timeseries.annotation-editor2.label-description', 'Description')}
                  invalid={!!errors.description}
                  error={errors?.description?.message}
                >
                  <TextArea
                    id={'annotation-description-textarea'}
                    data-testid={'annotation-editor-description'}
                    {...stylex.props(annotationEditor2Styles.textarea)}
                    {...register('description', {
                      required: 'Annotation description is required',
                    })}
                  />
                </Field>
                <Field htmlFor={'annotation-tags-input'} label={t('timeseries.annotation-editor2.label-tags', 'Tags')}>
                  <Controller
                    control={control}
                    name="tags"
                    render={({ field: { ref, onChange, ...field } }) => {
                      return (
                        <TagFilter
                          inputId={'annotation-tags-input'}
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
              <div {...stylex.props(annotationEditor2Styles.footer)}>
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

;
