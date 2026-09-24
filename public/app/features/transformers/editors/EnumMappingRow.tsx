import { Draggable } from '@hello-pangea/dnd';
import * as stylex from '@stylexjs/stylex';
import { type FormEvent, useState, type KeyboardEvent, useRef, useEffect } from 'react';

import { t } from '@grafana/i18n';
import { Icon, Input, IconButton, FieldValidationMessage, Stack } from '@grafana/ui';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';

type EnumMappingRowProps = {
  transformIndex: number;
  value: string;
  index: number;
  mappedIndex: number;
  onChangeEnumValue: (index: number, value: string) => void;
  onRemoveEnumRow: (index: number) => void;
  checkIsEnumUniqueValue: (value: string) => boolean;
};

const EnumMappingRow = ({
  transformIndex,
  value,
  index,
  mappedIndex,
  onChangeEnumValue,
  onRemoveEnumRow,
  checkIsEnumUniqueValue,
}: EnumMappingRowProps) => {
  const [enumValue, setEnumValue] = useState<string>(value);
  // If the enum value is empty, we assume it is a new row and should be editable
  const [isEditing, setIsEditing] = useState<boolean>(enumValue === '');
  const [validationError, setValidationError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input field if it is rendered
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const onEnumInputChange = (event: FormEvent<HTMLInputElement>) => {
    if (
      event.currentTarget.value !== '' &&
      checkIsEnumUniqueValue(event.currentTarget.value) &&
      event.currentTarget.value !== value
    ) {
      setValidationError('Enum value already exists');
    } else {
      setValidationError(null);
    }

    setEnumValue(event.currentTarget.value);
  };

  const onEnumInputBlur = () => {
    setIsEditing(false);
    setValidationError(null);

    // Do not add empty or duplicate enum values
    if (enumValue === '' || validationError !== null) {
      onRemoveEnumRow(mappedIndex);
      return;
    }

    onChangeEnumValue(mappedIndex, enumValue);
  };

  const onEnumInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onEnumInputBlur();
    }
  };

  const onEnumValueClick = () => {
    setIsEditing(true);
  };

  const onRemoveButtonClick = () => {
    onRemoveEnumRow(mappedIndex);
  };

  return (
    <Draggable key={`${transformIndex}/${value}`} draggableId={`${transformIndex}/${value}`} index={index}>
      {(provided) => (
        <tr key={index} ref={provided.innerRef} {...provided.draggableProps}>
          <td {...stylex.props(styles.cell)}>
            <div {...stylex.props(styles.dragHandle)} {...provided.dragHandleProps}>
              <Icon
                name="draggabledots"
                size="lg"
                title={t('transformers.enum-mapping-row.drag-handle-label', 'Reorder enum mapping row')}
              />
            </div>
          </td>
          {isEditing ? (
            <td {...stylex.props(styles.cell)}>
              <Input
                ref={inputRef}
                type="text"
                value={enumValue}
                onChange={onEnumInputChange}
                onBlur={onEnumInputBlur}
                onKeyDown={onEnumInputKeyDown}
              />
              {validationError && <FieldValidationMessage>{validationError}</FieldValidationMessage>}
            </td>
          ) : (
            // TODO fix accessibility issue here
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
            <td onClick={onEnumValueClick} {...stylex.props(styles.cell, styles.clickableTableCell)}>
              {value && value !== '' ? value : t('transformers.enum-mapping-row.click-to-edit', 'Click to edit')}
            </td>
          )}
          <td {...stylex.props(styles.cell, styles.textAlignCenter)}>
            <Stack gap={1}>
              <IconButton
                name="trash-alt"
                onClick={onRemoveButtonClick}
                data-testid="remove-enum-row"
                aria-label={t(
                  'transformers.enum-mapping-row.remove-enum-row-aria-label-delete-enum-row',
                  'Delete enum row'
                )}
                tooltip={t('transformers.enum-mapping-row.remove-enum-row-tooltip-delete', 'Delete')}
              />
            </Stack>
          </td>
        </tr>
      )}
    </Draggable>
  );
};

const styles = stylex.create({
  cell: {
    paddingTop: spacing['--gf-spacing-x0-5'],
    paddingRight: spacing['--gf-spacing-x0-5'],
    paddingBottom: spacing['--gf-spacing-x0-5'],
    paddingLeft: spacing['--gf-spacing-x0-5'],
  },
  dragHandle: {
    cursor: 'grab',
  },

  textAlignCenter: {
    textAlign: 'center',
  },

  clickableTableCell: {
    cursor: 'pointer',
    width: '100px',

    color: {
      default: null,
      ':hover': colors['--gf-colors-text-max-contrast'],
    },
  },
});

export default EnumMappingRow;
