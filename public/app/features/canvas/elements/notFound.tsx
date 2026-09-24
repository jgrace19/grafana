import * as stylex from '@stylexjs/stylex';
import { memo } from 'react';

import { Trans } from '@grafana/i18n';
import { colors, typography } from '@grafana/ui/stylex/tokens.stylex';

import { type CanvasElementItem, type CanvasElementProps } from '../element';

const NotFoundDisplay = memo(({ config }: CanvasElementProps) => {
  return (
    <div {...stylex.props(styles.container)}>
      <Trans
        i18nKey="canvas.not-found-display.not-found"
        components={{ config: <pre>{JSON.stringify(config, null, 2)}</pre> }}
      >
        <span {...stylex.props(styles.heading)}>Not found: </span>
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

const styles = stylex.create({
  container: { backgroundColor: colors['--gf-colors-background-canvas'] },
  heading: {
    fontFamily: typography['--gf-typography-h3-font-family'],
    fontWeight: typography['--gf-typography-h3-font-weight'],
    fontSize: typography['--gf-typography-h3-font-size'],
    lineHeight: typography['--gf-typography-h3-line-height'],
    letterSpacing: typography['--gf-typography-h3-letter-spacing'],
  },
});
