import * as stylex from '@stylexjs/stylex';
import { functionParamEditorStyles } from './FunctionParamEditor.stylex';

import { Segment, SegmentInput } from '@grafana/ui';

export type EditableParam = {
  name: string;
  value: string;
  optional: boolean;
  multiple: boolean;
  options: Array<SelectableValue<string>>;
};

type FieldEditorProps = {
  editableParam: EditableParam;
  onChange: (value: string) => void;
  onExpandedChange: (expanded: boolean) => void;
  autofocus: boolean;
};

/**
 * Render a function parameter with a segment dropdown for multiple options or simple input.
 */
export function FunctionParamEditor({ editableParam, onChange, onExpandedChange, autofocus }: FieldEditorProps) {

  if (editableParam.options?.length > 0) {
    return (
      <Segment
        autofocus={autofocus}
        value={editableParam.value}
        inputPlaceholder={editableParam.name}
        {...stylex.props(functionParamEditorStyles.segment)}
        options={editableParam.options}
        placeholder={' +' + editableParam.name}
        onChange={(value) => {
          onChange(value.value || '');
        }}
        onExpandedChange={onExpandedChange}
        inputMinWidth={150}
        allowCustomValue={true}
        allowEmptyValue={true}
      ></Segment>
    );
  } else {
    return (
      <SegmentInput
        autofocus={autofocus}
        {...stylex.props(functionParamEditorStyles.input)}
        value={editableParam.value || ''}
        placeholder={' +' + editableParam.name}
        inputPlaceholder={editableParam.name}
        onChange={(value) => {
          onChange(value.toString());
        }}
        onExpandedChange={onExpandedChange}
        // input style
        style={{
          height: '25px',
          paddingTop: '2px',
          marginTop: '2px',
          paddingLeft: '4px',
          minWidth: '100px',
        }}
      ></SegmentInput>
    );
  }
}

