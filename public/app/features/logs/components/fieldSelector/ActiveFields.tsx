import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { activeFieldsStyles } from './ActiveFields.stylex';
import { DragDropContext, Draggable, type DraggableProvided, Droppable, type DropResult } from '@hello-pangea/dnd';
import { useCallback, useMemo } from 'react';

import { type GrafanaTheme2 } from '@grafana/data';
import { t, Trans } from '@grafana/i18n';
import { reportInteraction } from '@grafana/runtime';

import { Field } from './Field';
import { type FieldWithStats } from './FieldSelector';
import { LogLevelField } from './LogLevelField';

interface Props {
  activeFields: string[];
  clear(): void;
  fields: FieldWithStats[];
  logLevelActive?: boolean;
  reorder: (columns: string[]) => void;
  suggestedFields: FieldWithStats[];
  toggle: (key: string) => void;
  toggleLevel?: () => void;
}

export const ActiveFields = ({
  activeFields,
  clear,
  fields,
  logLevelActive,
  reorder,
  suggestedFields,
  toggle,
  toggleLevel,
}: Props) => {

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) {
        return;
      }
      const newActiveFields = [...activeFields];
      const element = activeFields[result.source.index];

      newActiveFields.splice(result.source.index, 1);
      newActiveFields.splice(result.destination.index, 0, element);

      reorder(newActiveFields);
    },
    [activeFields, reorder]
  );

  const active = useMemo(
    () => [
      ...activeFields
        .map(
          (name) => fields.find((field) => field.name === name) ?? suggestedFields.find((field) => field.name === name)
        )
        .filter((field) => field !== undefined),
    ],
    [activeFields, fields, suggestedFields]
  );

  const suggested = useMemo(
    () => suggestedFields.filter((suggestedField) => !activeFields.includes(suggestedField.name)),
    [activeFields, suggestedFields]
  );

  const toggleSelectedField = useCallback(
    (key: string) => {
      toggle(key);
      reportInteraction('logs_field_selector_suggested_field_clicked');
    },
    [toggle]
  );

  return (
    <>
      {logLevelActive !== undefined && toggleLevel && (
        <div {...stylex.props(activeFieldsStyles.columnWrapper)}>
          <LogLevelField active={Boolean(logLevelActive)} toggle={toggleLevel} />
        </div>
      )}
      {(active.length || suggested.length) && (
        <>
          <div {...stylex.props(activeFieldsStyles.columnHeader)}>
            <Trans i18nKey="explore.logs-table-multi-select.selected-fields">Selected fields</Trans>
            {active.length > 0 && (
              <button onClick={clear} {...stylex.props(activeFieldsStyles.columnHeaderButton)}>
                <Trans i18nKey="explore.logs-table-multi-select.reset">Reset</Trans>
              </button>
            )}
          </div>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="order-fields" direction="vertical">
              {(provided) => (
                <div {...stylex.props(activeFieldsStyles.columnWrapper)} {...provided.droppableProps} ref={provided.innerRef}>
                  {active.map((field, index) => (
                    <Draggable
                      draggableId={field.name}
                      key={field.name}
                      index={index}
                      isDragDisabled={!activeFields.includes(field.name)}
                    >
                      {(provided: DraggableProvided, snapshot) => (
                        <div
                          {...mergeStylexClassName(stylex.props(activeFieldsStyles.wrap, , snapshot.isDragging ? styles.dragging : undefined), undefined)}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          title={t(
                            'logs.field-selector.label-title',
                            `{{fieldName}} appears in {{percentage}}% of log lines`,
                            { fieldName: field.name, percentage: field.stats.percentOfLinesWithLabel }
                          )}
                        >
                          <Field
                            active={activeFields.includes(field.name)}
                            field={field}
                            toggle={toggle}
                            draggable={activeFields.includes(field.name)}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          {suggested.length > 0 && (
            <>
              <div {...stylex.props(activeFieldsStyles.columnSubHeader)}>
                <Trans i18nKey="explore.logs-table-multi-select.suggested-fields">Suggested</Trans>
              </div>
              <div {...stylex.props(activeFieldsStyles.columnWrapper)}>
                {suggested.map((field) => (
                  <div {...stylex.props(activeFieldsStyles.wrap)} key={field.name}>
                    <Field field={field} toggle={toggleSelectedField} />
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

const cn = (key: keyof typeof activeFieldsStyles) =>
  mergeStylexClassName(stylex.props(activeFieldsStyles[key]), undefined).className ?? '';

/** @deprecated Emotion compat — use activeFieldsStyles with StyleX. */
export function getLogsFieldsStyles(_theme: GrafanaTheme2) {
  return {
    wrap: cn('wrap'),
    dragging: cn('dragging'),
    columnHeader: cn('columnHeader'),
    columnSubHeader: cn('columnSubHeader'),
    columnHeaderButton: cn('columnHeaderButton'),
    columnWrapper: cn('columnWrapper'),
  };
}

