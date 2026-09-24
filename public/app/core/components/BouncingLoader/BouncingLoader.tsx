import * as stylex from '@stylexjs/stylex';

import { t } from '@grafana/i18n';

import { Branding } from '../Branding/Branding';

import { bouncingLoaderStyles } from './BouncingLoader.stylex';

export function BouncingLoader() {
  return (
    <div
      {...stylex.props(bouncingLoaderStyles.container)}
      aria-live="polite"
      role="status"
      aria-label={t('bouncing-loader.label', 'Loading')}
    >
      <div {...stylex.props(bouncingLoaderStyles.bounce)}>
        <Branding.LoginLogo {...stylex.props(bouncingLoaderStyles.logo)} />
      </div>
    </div>
  );
}
