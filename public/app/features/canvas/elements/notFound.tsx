import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { notFoundStyles } from './notFound.stylex';
import { memo } from 'react';

import { Trans } from '@grafana/i18n';

import { type CanvasElementItem, type CanvasElementProps } from '../element';

const NotFoundDisplay = memo(({ config }: CanvasElementProps) => {
  return (
    <div {...stylex.props(notFoundStyles.container)}>
      <Trans
        i18nKey="canvas.not-found-display.not-found"
        components={{ config: <pre>{JSON.stringify(config, null, 2)}</pre> }}
      >
        <span {...stylex.props(notFoundStyles.heading)}>Not found: </span>
        {'<config />'}
      </Trans>
    </div>
  );
});

NotFoundDisplay.displayName = 'NotFoundDisplay';

export const notFoundItem: CanvasElementItem = {
  id: 'not-found',
  name: 'Not found',
  description: 'Display when element type is not found in the registry',

  display: NotFoundDisplay,

  defaultSize: {
    width: 100,
    height: 100,
  },

  getNewOptions: () => ({
    config: {},
  }),
};

