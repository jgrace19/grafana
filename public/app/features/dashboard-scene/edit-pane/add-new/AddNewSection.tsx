import * as stylex from '@stylexjs/stylex';

import { Stack, Text } from '@grafana/ui';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';

type AddNewSectionProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function AddNewSection({ title, description, children }: AddNewSectionProps) {
  return (
    <div {...stylex.props(styles.section)}>
      <div {...stylex.props(styles.sectionHeader)}>
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

const styles = stylex.create({
  section: {
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors['--gf-colors-border-weak'],
    paddingTop: spacing['--gf-spacing-x2'],
    paddingRight: spacing['--gf-spacing-x2'],
    paddingBottom: spacing['--gf-spacing-x2'],
    paddingLeft: spacing['--gf-spacing-x2'],
  },
  sectionHeader: {
    marginTop: 0,
    marginRight: 0,
    marginBottom: spacing['--gf-spacing-x2'],
    marginLeft: 0,
  },
});
