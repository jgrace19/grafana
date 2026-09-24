import * as stylex from '@stylexjs/stylex';
import { useCallback, useEffect, useState } from 'react';
import * as React from 'react';

import { t } from '@grafana/i18n';
import { isFetchError } from '@grafana/runtime';
import { Field, IconButton, Input, Text } from '@grafana/ui';
import { components, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

export interface Props {
  value: string;
  onEdit: (newValue: string) => Promise<void>;
}

export const EditableTitle = ({ value, onEdit }: Props) => {
  const [localValue, setLocalValue] = useState(value);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  // sync local value with prop value
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const onCommitChange = useCallback(
    async (event: React.FormEvent<HTMLInputElement>) => {
      const newValue = event.currentTarget.value;

      if (!newValue) {
        setErrorMessage('Please enter a title');
      } else if (newValue === value) {
        // no need to bother saving if the value hasn't changed
        // just clear any previous error messages and exit edit mode
        setErrorMessage(undefined);
        setIsEditing(false);
      } else {
        setIsLoading(true);
        try {
          await onEdit(newValue);
          setErrorMessage(undefined);
          setIsEditing(false);
        } catch (error) {
          if (isFetchError(error)) {
            setErrorMessage(error.data.message);
          } else if (error instanceof Error) {
            setErrorMessage(error.message);
          }
        }
        setIsLoading(false);
      }
    },
    [onEdit, value]
  );

  return !isEditing ? (
    <div {...stylex.props(styles.textContainer)}>
      <div {...stylex.props(styles.textWrapper)}>
        {/*
          use localValue instead of value
          this is to prevent the title from flickering back to the old value after the user has edited
          caused by the delay between the save completing and the new value being refetched
        */}
        <Text element="h1" truncate>
          {localValue}
        </Text>
        <IconButton
          name="pen"
          size="lg"
          tooltip={t('page.editable-title.edit-tooltip', 'Edit title')}
          onClick={() => setIsEditing(true)}
        />
      </div>
    </div>
  ) : (
    <div {...stylex.props(styles.inputContainer)}>
      <Field xstyle={styles.field} loading={isLoading} invalid={!!errorMessage} error={errorMessage}>
        <Input
          inputXstyle={styles.input}
          defaultValue={localValue}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              onCommitChange(event);
            }
          }}
          // perfectly reasonable to autofocus here since we've made a conscious choice by clicking the edit button
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          onBlur={onCommitChange}
          onChange={(event) => setLocalValue(event.currentTarget.value)}
          onFocus={() => setIsEditing(true)}
        />
      </Field>
    </div>
  );
};

EditableTitle.displayName = 'EditableTitle';

const styles = stylex.create({
  textContainer: {
    minWidth: 0,
  },
  inputContainer: {
    display: 'flex',
    flex: '1',
  },
  textWrapper: {
    alignItems: 'center',
    display: 'flex',
    gap: spacing['--gf-spacing-x1'],
    height: `calc(${spacing['--gf-spacing-grid-size']} * ${components['--gf-components-height-md']})`,
  },
  field: {
    flex: '1',
    // magic number here to ensure the input text lines up exactly with the h1 text
    // input has a 1px border + theme.spacing(1) padding so we need to offset that
    left: `calc(-1 * ${spacing['--gf-spacing-grid-size']} - 1px)`,
    position: 'relative',
    marginBottom: 0,
  },
  input: {
    fontFamily: typography['--gf-typography-h1-font-family'],
    fontWeight: typography['--gf-typography-h1-font-weight'],
    fontSize: typography['--gf-typography-h1-font-size'],
    lineHeight: typography['--gf-typography-h1-line-height'],
    letterSpacing: typography['--gf-typography-h1-letter-spacing'],
  },
});
