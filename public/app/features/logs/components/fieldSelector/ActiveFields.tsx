import { DragDropContext, Draggable, type DraggableProvided, Droppable, type DropResult } from '@hello-pangea/dnd';
import * as stylex from '@stylexjs/stylex';
import { useCallback, useMemo } from 'react';

import { t, Trans } from '@grafana/i18n';
import { reportInteraction } from '@grafana/runtime';
import { colors, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

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
        <div {...stylex.props(logsFieldsStyles.columnWrapper)}>
          <LogLevelField active={Boolean(logLevelActive)} toggle={toggleLevel} />
        </div>
      )}
      {(active.length || suggested.length) && (
        <>
          <div {...stylex.props(logsFieldsStyles.columnHeader)}>
            <Trans i18nKey="explore.logs-table-multi-select.selected-fields">Selected fields</Trans>
            {active.length > 0 && (
              <button onClick={clear} {...stylex.props(logsFieldsStyles.columnHeaderButton)}>
                <Trans i18nKey="explore.logs-table-multi-select.reset">Reset</Trans>
              </button>
            )}
          </div>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="order-fields" direction="vertical">
              {(provided) => (
                <div
                  {...stylex.props(logsFieldsStyles.columnWrapper)}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {active.map((field, index) => (
                    <Draggable
                      draggableId={field.name}
                      key={field.name}
                      index={index}
                      isDragDisabled={!activeFields.includes(field.name)}
                    >
                      {(provided: DraggableProvided, snapshot) => (
                        <div
                          {...stylex.props(logsFieldsStyles.wrap, snapshot.isDragging && logsFieldsStyles.dragging)}
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
              <div {...stylex.props(logsFieldsStyles.columnSubHeader)}>
                <Trans i18nKey="explore.logs-table-multi-select.suggested-fields">Suggested</Trans>
              </div>
              <div {...stylex.props(logsFieldsStyles.columnWrapper)}>
                {suggested.map((field) => (
                  <div {...stylex.props(logsFieldsStyles.wrap)} key={field.name}>
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

// theme.typography.pxToRem(11), derived from the 12px bodySmall size so it follows the theme's font sizes.
const smallFontSize = `calc(${typography['--gf-typography-body-small-font-size']} * 11 / 12)`;

export const logsFieldsStyles = stylex.create({
  wrap: {
    marginTop: spacing['--gf-spacing-x1'],
    marginBottom: spacing['--gf-spacing-x1'],
    display: 'flex',
    backgroundColor: colors['--gf-colors-background-primary'],
  },
  dragging: {
    backgroundColor: colors['--gf-colors-background-secondary'],
  },
  columnHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: typography['--gf-typography-h6-font-size'],
    backgroundColor: colors['--gf-colors-background-secondary'],
    position: 'sticky',
    top: 0,
    left: 0,
    paddingTop: `calc(${spacing['--gf-spacing-grid-size']} * 0.75)`,
    paddingRight: `calc(${spacing['--gf-spacing-grid-size']} * 0.75)`,
    paddingBottom: `calc(${spacing['--gf-spacing-grid-size']} * 0.75)`,
    paddingLeft: `calc(${spacing['--gf-spacing-grid-size']} * 1.5)`,
    zIndex: 3,
    marginBottom: spacing['--gf-spacing-x2'],
  },
  columnSubHeader: {
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: `calc(${spacing['--gf-spacing-grid-size']} * 0.75)`,
    paddingLeft: spacing['--gf-spacing-x0-5'],
    color: colors['--gf-colors-text-secondary'],
  },
  columnHeaderButton: {
    appearance: 'none',
    backgroundColor: 'transparent',
    backgroundImage: 'none',
    borderStyle: 'none',
    fontSize: smallFontSize,
  },
  columnWrapper: {
    marginBottom: `calc(${spacing['--gf-spacing-grid-size']} * 1.5)`,
    // need some space or the outline of the checkbox is cut off
    paddingLeft: spacing['--gf-spacing-x0-5'],
  },
});
