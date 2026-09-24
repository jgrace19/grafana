import { type StoryFn, type Meta } from '@storybook/react';
import * as stylex from '@stylexjs/stylex';
import tinycolor from 'tinycolor2';

import { InlineList } from './InlineList';
import { List } from './List';

const meta: Meta = {
  title: 'Layout/Deprecated/List',
  component: List,
  parameters: {
    controls: {
      exclude: ['renderItem', 'getItemKey', 'className', 'items'],
    },
  },
  args: {
    itemRenderer: 'raw',
    numberOfItems: 3,
  },
  argTypes: {
    itemRenderer: {
      control: {
        type: 'select',
        options: ['raw', 'custom'],
      },
    },
  },
};

export default meta;

const generateListItems = (numberOfItems: number) => {
  return [...new Array(numberOfItems)].map((item, i) => {
    return {
      name: `Item-${i}`,
      id: `item-${i}`,
    };
  });
};

const getItem = (inline = false) => {
  const rawRenderer = (item: ReturnType<typeof generateListItems>[0]) => <>{item.name}</>;
  const customRenderer = (item: ReturnType<typeof generateListItems>[0], index: number) => (
    <div
      {...stylex.props(
        styles.item,
        styles.background(tinycolor.fromRatio({ h: index / 26, s: 1, v: 1 }).toHexString()),
        inline ? styles.inline : styles.block
      )}
    >
      {item.name}
    </div>
  );

  return {
    rawRenderer,
    customRenderer,
  };
};

export const basic: StoryFn = (args) => {
  const { rawRenderer, customRenderer } = getItem();
  return (
    <List
      items={generateListItems(args.numberOfItems)}
      renderItem={args.itemRenderer === 'raw' ? rawRenderer : customRenderer}
    />
  );
};

export const inline: StoryFn = (args) => {
  const { rawRenderer, customRenderer } = getItem(true);
  return (
    <InlineList
      items={generateListItems(args.numberOfItems)}
      renderItem={args.itemRenderer === 'raw' ? rawRenderer : customRenderer}
    />
  );
};

const styles = stylex.create({
  item: {
    color: 'white',
    fontWeight: 'bold',
    paddingTop: '10px',
    paddingRight: '10px',
    paddingBottom: '10px',
    paddingLeft: '10px',
  },
  background: (backgroundColor: string) => ({ backgroundColor }),
  inline: {
    marginRight: '20px',
  },
  block: {
    marginBottom: '20px',
  },
});
