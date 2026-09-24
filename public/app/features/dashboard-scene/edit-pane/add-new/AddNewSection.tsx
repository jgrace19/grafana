import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { addNewSectionStyles } from './AddNewSection.stylex';

import {Stack, Text} from '@grafana/ui';

type AddNewSectionProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function AddNewSection({ title, description, children }: AddNewSectionProps) {

  return (
    <div {...stylex.props(addNewSectionStyles.section)}>
      <div {...stylex.props(addNewSectionStyles.sectionHeader)}>
        <Text weight="medium">{title}</Text>
        <Text element="p" variant="bodySmall" color="secondary">
          {description || ''}
        </Text>
      </div>
      <Stack direction="column" gap={2}>
        {children}
      </Stack>
    </div>
  );
}


