import * as stylex from '@stylexjs/stylex';

import { Stack } from '@grafana/ui';

import { useAlertingHomePageExtensions } from '../plugins/useAlertingHomePageExtensions';

export function PluginIntegrations() {

  const { components } = useAlertingHomePageExtensions();

  if (components.length === 0) {
    return null;
  }

  return (
    <Stack gap={2} wrap="wrap" direction="row">
      {components.map((Component, i) => (
        <div key={i} {...stylex.props(pluginIntegrationsStyles.box)}>
          <Component />
        </div>
      ))}
    </Stack>
  );
}

