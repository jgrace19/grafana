import * as stylex from '@stylexjs/stylex';

import { Stack } from '@grafana/ui';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';

import { useAlertingHomePageExtensions } from '../plugins/useAlertingHomePageExtensions';

export function PluginIntegrations() {
  const { components } = useAlertingHomePageExtensions();

  if (components.length === 0) {
    return null;
  }

  return (
    <Stack gap={2} wrap="wrap" direction="row">
      {components.map((Component, i) => (
        <div key={i} {...stylex.props(styles.box)}>
          <Component />
        </div>
      ))}
    </Stack>
  );
}

const styles = stylex.create({
  box: {
    padding: spacing['--gf-spacing-x2'],
    flex: '1',
    backgroundColor: colors['--gf-colors-background-secondary'],
    maxWidth: '460px',
  },
});
