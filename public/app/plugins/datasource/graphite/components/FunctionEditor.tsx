import * as stylex from '@stylexjs/stylex';
import { functionEditorStyles } from './FunctionEditor.stylex';

import { memo } from 'react';

import { Icon, TextLink, Tooltip, type PopoverContent } from '@grafana/ui';

import { type FuncInstance } from '../gfunc';

import { FunctionEditorControls, type FunctionEditorControlsProps } from './FunctionEditorControls';

interface FunctionEditorProps extends FunctionEditorControlsProps {
  func: FuncInstance;
}

;

const FunctionEditor = ({ onMoveLeft, onMoveRight, func, ...props }: FunctionEditorProps) => {

  const renderContent: PopoverContent = ({ updatePopperPosition }) => (
    <FunctionEditorControls
      {...props}
      func={func}
      onMoveLeft={() => {
        onMoveLeft(func);
        updatePopperPosition?.();
      }}
      onMoveRight={() => {
        onMoveRight(func);
        updatePopperPosition?.();
      }}
    />
  );

  return (
    <>
      {func.def.unknown && (
        <Tooltip content={<TooltipContent />} placement="bottom" interactive>
          <Icon data-testid="warning-icon" name="exclamation-triangle" size="xs" {...stylex.props(functionEditorStyles.icon)} />
        </Tooltip>
      )}
      <Tooltip content={renderContent} placement="top" interactive>
        <span {...stylex.props(functionEditorStyles.label)}>{func.def.name}</span>
      </Tooltip>
    </>
  );
};

const TooltipContent = memo(() => {
  return (
    <span>
      This function is not supported. Check your function for typos and{' '}
      <TextLink external href="https://graphite.readthedocs.io/en/latest/functions.html">
        read the docs
      </TextLink>{' '}
      to see whether you need to upgrade your data source’s version to make this function available.
    </span>
  );
});
TooltipContent.displayName = 'FunctionEditorTooltipContent';

export { FunctionEditor };
