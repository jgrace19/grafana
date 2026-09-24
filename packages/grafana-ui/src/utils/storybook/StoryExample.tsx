import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { Stack } from '../../components/Layout/Stack/Stack';
import { Text } from '../../components/Text/Text';

export interface Props {
  name: string;
  children?: React.ReactNode;
}

export const StoryExample = ({ name, children }: Props) => {
  return (
    <div {...stylex.props(styles.example)}>
      <Stack gap={2} direction="column">
        <Text variant="h5">{name}</Text>
        {children}
      </Stack>
    </div>
  );
};

StoryExample.displayName = 'StoryExample';

const styles = stylex.create({
  example: {
    width: '100%',
    padding: '16px',
  },
});
