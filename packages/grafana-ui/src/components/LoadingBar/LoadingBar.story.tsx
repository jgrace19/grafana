import { type Meta, type StoryFn } from '@storybook/react';
import * as stylex from '@stylexjs/stylex';

import { components, shape } from '../../themes/stylex/tokens.stylex';
import { DashboardStoryCanvas } from '../../utils/storybook/DashboardStoryCanvas';

import { LoadingBar, type LoadingBarProps } from './LoadingBar';
import mdx from './LoadingBar.mdx';

const meta: Meta<typeof LoadingBar> = {
  title: 'Information/LoadingBar',
  component: LoadingBar,
  parameters: {
    controls: {},
    docs: {
      page: mdx,
    },
  },
};

export const Basic: StoryFn<typeof LoadingBar> = (args: LoadingBarProps) => {
  return (
    <DashboardStoryCanvas>
      <div {...stylex.props(styles.container)}>
        <LoadingBar {...args} />
      </div>
    </DashboardStoryCanvas>
  );
};

Basic.args = {
  width: 400,
};

const styles = stylex.create({
  container: {
    width: '400px',
    height: '200px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: components['--gf-components-panel-border-color'],
    borderRadius: shape['--gf-shape-radius-default'],
  },
});

export default meta;
