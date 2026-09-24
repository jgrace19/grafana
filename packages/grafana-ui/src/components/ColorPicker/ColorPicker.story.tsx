import { action } from '@storybook/addon-actions';
import { useArgs } from '@storybook/preview-api';
import { type Meta, type StoryFn } from '@storybook/react';
import * as stylex from '@stylexjs/stylex';

import { colors } from '../../themes/stylex/tokens.stylex';

import { ColorPicker } from './ColorPicker';
import mdx from './ColorPicker.mdx';

const meta: Meta<typeof ColorPicker> = {
  title: 'Pickers/ColorPicker',
  component: ColorPicker,
  parameters: {
    docs: {
      page: mdx,
    },
    controls: {
      exclude: ['onChange', 'onColorChange'],
    },
  },
  args: {
    enableNamedColors: false,
    color: '#ee0000',
  },
};

export const Basic: StoryFn<typeof ColorPicker> = ({ color, enableNamedColors }) => {
  const [, updateArgs] = useArgs();

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
      <ColorPicker
        enableNamedColors={enableNamedColors}
        color={color}
        onChange={(color: string) => {
          action('Color changed')(color);
          updateArgs({ color });
        }}
      />
    </div>
  );
};

export const CustomTrigger: StoryFn<typeof ColorPicker> = ({ color, enableNamedColors }) => {
  const [, updateArgs] = useArgs();
  return (
    <ColorPicker
      enableNamedColors={enableNamedColors}
      color={color}
      onChange={(color: string) => {
        action('Color changed')(color);
        updateArgs({ color });
      }}
    >
      {({ ref, showColorPicker, hideColorPicker }) => (
        <button
          type="button"
          ref={ref}
          onMouseLeave={hideColorPicker}
          onClick={showColorPicker}
          className={stylex.props(styles.clearButton).className}
          style={{ color: 'white', backgroundColor: color, padding: '8px' }}
        >
          Open color picker
        </button>
      )}
    </ColorPicker>
  );
};

export default meta;

const styles = stylex.create({
  clearButton: {
    backgroundColor: 'transparent',
    color: colors['--gf-colors-text-primary'],
    borderStyle: 'none',
    padding: 0,
  },
});
