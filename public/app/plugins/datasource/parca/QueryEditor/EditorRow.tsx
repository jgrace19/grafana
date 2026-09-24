import * as stylex from '@stylexjs/stylex';
import { editorRowStyles } from './EditorRow.stylex';

import * as React from 'react';


import { Stack } from './Stack';

interface EditorRowProps {
  children: React.ReactNode;
  stackProps?: Partial<React.ComponentProps<typeof Stack>>;
}

export const EditorRow = ({ children, stackProps }: EditorRowProps) => {

  return (
    <div {...stylex.props(editorRowStyles.root)}>
      <Stack gap={2} {...stackProps}>
        {children}
      </Stack>
    </div>
  );
};

;
