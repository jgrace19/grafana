import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { editableTitleStyles } from './EditableTitle.stylex';
import { useCallback, useEffect, useState } from 'react';
import * as React from 'react';

import { t } from '@grafana/i18n';
import { isFetchError } from '@grafana/runtime';
import { Field, IconButton, Input, Text } from '@grafana/ui';

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
    <div {...stylex.props(editableTitleStyles.textContainer)}>
      <div {...stylex.props(editableTitleStyles.textWrapper)}>
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
    <div {...stylex.props(editableTitleStyles.inputContainer)}>
      <Field {...stylex.props(editableTitleStyles.field)} loading={isLoading} invalid={!!errorMessage} error={errorMessage}>
        <Input
          {...stylex.props(editableTitleStyles.input)}
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

