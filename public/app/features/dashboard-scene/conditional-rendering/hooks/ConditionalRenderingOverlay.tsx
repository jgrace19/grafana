import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { conditionalRenderingOverlayStyles } from './ConditionalRenderingOverlay.stylex';

import { t } from '@grafana/i18n';
import {Icon, Tooltip} from '@grafana/ui';

export const ConditionalRenderingOverlay = () => {


  return (
    <div {...stylex.props(conditionalRenderingOverlayStyles.container)}>
      <Tooltip content={t('dashboard.conditional-rendering.overlay.tooltip', 'Element is hidden by show/hide rules.')}>
        <Icon name="eye-slash" />
      </Tooltip>
    </div>
  );
};

