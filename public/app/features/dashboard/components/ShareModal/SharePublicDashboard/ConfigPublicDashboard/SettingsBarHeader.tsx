import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { settingsBarHeaderStyles } from './SettingsBarHeader.stylex';
import * as React from 'react';

import { t } from '@grafana/i18n';
import { IconButton, ReactUtils, useStyles2 } from '@grafana/ui';

export interface Props {
  onRowToggle: () => void;
  isContentVisible?: boolean;
  title?: string;
  headerElement?: React.ReactNode | ((props: { className?: string }) => React.ReactNode);
}

export function SettingsBarHeader({ headerElement, isContentVisible = false, onRowToggle, title, ...rest }: Props) {

  const headerElementRendered =
    headerElement && ReactUtils.renderOrCallToRender(headerElement, { className: mergeStylexClassName(stylex.props(settingsBarHeaderStyles.summaryWrapper), undefined).className });

  return (
    <div {...stylex.props(settingsBarHeaderStyles.wrapper)}>
      <div {...stylex.props(settingsBarHeaderStyles.header)}>
        <IconButton
          name={isContentVisible ? 'angle-down' : 'angle-right'}
          tooltip={
            isContentVisible
              ? t('public-dashboard.settings-bar-header.collapse-settings-tooltip', 'Collapse settings')
              : t('public-dashboard.settings-bar-header.expand-settings-tooltip', 'Expand settings')
          }
          {...stylex.props(settingsBarHeaderStyles.collapseIcon)}
          onClick={onRowToggle}
          aria-expanded={isContentVisible}
          {...rest}
        />
        {title && (
          // disabling the a11y rules here as the IconButton above handles keyboard interactions
          // this is just to provide a better experience for mouse users
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
          <div {...stylex.props(settingsBarHeaderStyles.titleWrapper)} onClick={onRowToggle}>
            <span {...stylex.props(settingsBarHeaderStyles.title)}>{title}</span>
          </div>
        )}
        {headerElementRendered}
      </div>
    </div>
  );
}

SettingsBarHeader.displayName = 'SettingsBarHeader';

