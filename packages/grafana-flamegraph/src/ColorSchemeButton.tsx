import * as stylex from '@stylexjs/stylex';

import { Button, Dropdown, Menu } from '@grafana/ui';
import { mergeStylexClassName } from '@grafana/ui/unstable';

import { colorSchemeButtonStyles } from './ColorSchemeButton.stylex';
import { ColorScheme, ColorSchemeDiff } from './types';

type ColorSchemeButtonProps = {
  value: ColorScheme | ColorSchemeDiff;
  onChange: (colorScheme: ColorScheme | ColorSchemeDiff) => void;
  isDiffMode: boolean;
};

export function ColorSchemeButton(props: ColorSchemeButtonProps) {
  let menu = (
    <Menu>
      <Menu.Item label="By package name" onClick={() => props.onChange(ColorScheme.PackageBased)} />
      <Menu.Item label="By value" onClick={() => props.onChange(ColorScheme.ValueBased)} />
    </Menu>
  );

  const colorDotStyle =
    {
      [ColorScheme.ValueBased]: colorSchemeButtonStyles.colorDotByValue,
      [ColorScheme.PackageBased]: colorSchemeButtonStyles.colorDotByPackage,
      [ColorSchemeDiff.DiffColorBlind]: colorSchemeButtonStyles.colorDotDiffColorBlind,
      [ColorSchemeDiff.Default]: colorSchemeButtonStyles.colorDotDiffDefault,
    }[props.value] || colorSchemeButtonStyles.colorDotByValue;

  let contents = <span {...stylex.props(colorSchemeButtonStyles.colorDot, colorDotStyle)} />;

  if (props.isDiffMode) {
    menu = (
      <Menu>
        <Menu.Item label="Default (green to red)" onClick={() => props.onChange(ColorSchemeDiff.Default)} />
        <Menu.Item label="Color blind (blue to red)" onClick={() => props.onChange(ColorSchemeDiff.DiffColorBlind)} />
      </Menu>
    );

    contents = (
      <div {...stylex.props(colorSchemeButtonStyles.colorDotDiff, colorDotStyle)}>
        <div>-100% (removed)</div>
        <div>0%</div>
        <div>+100% (added)</div>
      </div>
    );
  }

  return (
    <Dropdown overlay={menu}>
      <Button
        variant={'secondary'}
        fill={'outline'}
        size={'sm'}
        tooltip={'Change color scheme'}
        onClick={() => {}}
        className={mergeStylexClassName(stylex.props(colorSchemeButtonStyles.buttonSpacing)).className}
        aria-label={'Change color scheme'}
      >
        {contents}
      </Button>
    </Dropdown>
  );
}
