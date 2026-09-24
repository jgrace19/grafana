import { type StoryFn, type Meta } from '@storybook/react';
import * as stylex from '@stylexjs/stylex';

import { spacing } from '../../themes/stylex/tokens.stylex';
import { type IconSize, type IconName } from '../../types/icon';
import { Stack } from '../Layout/Stack/Stack';

import {
  type BasePropsWithTooltip,
  IconButton,
  type IconButtonVariant,
  type Props as IconButtonProps,
} from './IconButton';
import mdx from './IconButton.mdx';

interface ScenarioProps {
  background: 'canvas' | 'primary' | 'secondary';
}

const defaultExcludes = ['ariaLabel', 'aria-label'];
const additionalExcludes = ['size', 'name', 'variant', 'iconType'];

const meta: Meta<typeof IconButton> = {
  title: 'Inputs/IconButton',
  component: IconButton,
  parameters: {
    docs: {
      page: mdx,
    },
    controls: { exclude: defaultExcludes },
  },
  args: {
    name: 'apps',
    size: 'md',
    iconType: 'default',
    tooltip: 'sample tooltip message',
    tooltipPlacement: 'top',
    variant: 'secondary',
  },
  argTypes: {
    tooltip: {
      control: 'text',
    },
  },
};

export const Basic: StoryFn<typeof IconButton> = (args: IconButtonProps) => {
  return <IconButton {...args} />;
};

export const ExamplesSizes = (args: BasePropsWithTooltip) => {
  const sizes: IconSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
  const icons: IconName[] = ['search', 'trash-alt', 'arrow-left', 'times'];
  const variants: IconButtonVariant[] = ['primary', 'secondary', 'destructive'];

  return (
    <Stack justifyContent="center">
      {variants.map((variant) => {
        return (
          <div key={variant} {...stylex.props(styles.variant)}>
            <p>{variant}</p>
            {icons.map((icon) => {
              return (
                <div {...stylex.props(styles.row)} key={icon}>
                  {sizes.map((size) => (
                    <span key={icon + size}>
                      <IconButton name={icon} size={size} variant={variant} tooltip={args.tooltip} />
                    </span>
                  ))}
                </div>
              );
            })}
          </div>
        );
      })}
      <div>
        <p>disabled</p>
        {icons.map((icon) => (
          <div {...stylex.props(styles.row)} key={icon}>
            {sizes.map((size) => (
              <span key={icon + size}>
                <IconButton name={icon} size={size} tooltip={args.tooltip} disabled />
              </span>
            ))}
          </div>
        ))}
      </div>
    </Stack>
  );
};

ExamplesSizes.parameters = {
  controls: {
    exclude: [...defaultExcludes, ...additionalExcludes],
  },
};

export const ExamplesBackground = (args: BasePropsWithTooltip) => {
  const RenderBackgroundScenario = ({ background }: ScenarioProps) => {
    const variants: IconButtonVariant[] = ['primary', 'secondary', 'destructive'];

    return (
      <div {...stylex.props(styles.scenario, styles.background(`var(--gf-colors-background-${background})`))}>
        <Stack direction="column" gap={2}>
          <div>{background}</div>
          <div {...stylex.props(styles.scenarioButtons)}>
            {variants.map((variant) => {
              return <IconButton name="times" size="xl" variant={variant} key={variant} tooltip={args.tooltip} />;
            })}
            <IconButton name="times" size="xl" tooltip={args.tooltip} disabled />
          </div>
        </Stack>
      </div>
    );
  };

  return (
    <div>
      <RenderBackgroundScenario background="canvas" />
      <RenderBackgroundScenario background="primary" />
      <RenderBackgroundScenario background="secondary" />
    </div>
  );
};

ExamplesBackground.parameters = {
  controls: {
    exclude: [...defaultExcludes, ...additionalExcludes],
  },
};

export default meta;

const styles = stylex.create({
  row: {
    display: 'flex',
    gap: spacing['--gf-spacing-x1'],
    marginBottom: spacing['--gf-spacing-x2'],
  },
  variant: {
    marginTop: 'auto',
    marginRight: spacing['--gf-spacing-x1'],
    marginBottom: 'auto',
    marginLeft: spacing['--gf-spacing-x1'],
  },
  scenario: {
    padding: '30px',
  },
  background: (backgroundColor: string) => ({
    backgroundColor,
  }),
  scenarioButtons: {
    display: 'flex',
    gap: spacing['--gf-spacing-x2'],
  },
});
