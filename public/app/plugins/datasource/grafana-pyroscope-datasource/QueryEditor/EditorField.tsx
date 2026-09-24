import * as stylex from '@stylexjs/stylex';
import { editorFieldStyles } from './EditorField.stylex';

import { type ComponentProps } from 'react';
import * as React from 'react';

import { Field, Icon, type PopoverContent, ReactUtils, Tooltip } from '@grafana/ui';

interface EditorFieldProps extends ComponentProps<typeof Field> {
  label: string;
  children: React.ReactElement<Record<string, unknown>>;
  width?: number | string;
  optional?: boolean;
  tooltip?: PopoverContent;
}

export const EditorField = (props: EditorFieldProps) => {
  const { label, optional, tooltip, children, width, ...fieldProps } = props;

  // Null check for backward compatibility
  const childInputId = fieldProps?.htmlFor || ReactUtils?.getChildId(children);

  const labelEl = (
    <>
      <label {...stylex.props(editorFieldStyles.label)} htmlFor={childInputId}>
        {label}
        {optional && <span {...stylex.props(editorFieldStyles.optional)}> - optional</span>}
        {tooltip && (
          <Tooltip placement="top" content={tooltip} theme="info">
            <Icon name="info-circle" size="sm" {...stylex.props(editorFieldStyles.icon)} />
          </Tooltip>
        )}
      </label>
      <span {...stylex.props(editorFieldStyles.space)} />
    </>
  );

  return (
    <div {...stylex.props(editorFieldStyles.root)}>
      <Field {...stylex.props(editorFieldStyles.field)} label={labelEl} {...fieldProps}>
        {children}
      </Field>
    </div>
  );
};

