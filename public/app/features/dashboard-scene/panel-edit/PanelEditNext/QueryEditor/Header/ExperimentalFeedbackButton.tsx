import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { experimentalFeedbackButtonStyles } from './ExperimentalFeedbackButton.stylex';
import { useRef } from 'react';

import { t } from '@grafana/i18n';
import {Button, Dropdown, Menu} from '@grafana/ui';

import { startIntercomSurvey } from '../../tracking';
import { useActionsContext, useQueryEditorUIContext } from '../QueryEditorContext';

export function ExperimentalFeedbackButton() {
  const { showVersionBanner } = useQueryEditorUIContext();
  const { onSwitchToClassic } = useActionsContext();


  // Track whether the banner was visible when this component first mounted.
  // If it was, the user dismissed it - animate the button in.
  // If it wasn't (already dismissed on load), skip the animation.
  const bannerWasInitiallyVisible = useRef(showVersionBanner);
  const shouldAnimate = bannerWasInitiallyVisible.current && !showVersionBanner;

  if (showVersionBanner || !onSwitchToClassic) {
    return null;
  }

  const menu = (
    <Menu>
      <Menu.Item
        label={t('query-editor-next.experimental-button.give-feedback', 'Give feedback')}
        icon="comment-alt-message"
        onClick={() => startIntercomSurvey()}
      />
      <Menu.Item
        label={t('query-editor-next.experimental-button.back-to-classic', 'Go back to classic editor')}
        icon="arrow-left"
        onClick={() => {
          startIntercomSurvey();
          onSwitchToClassic?.();
        }}
      />
    </Menu>
  );

  return (
    <div {...stylex.props(experimentalFeedbackButtonStyles.wrapper, shouldAnimate && experimentalFeedbackButtonStyles.animated)}>
      <Dropdown overlay={menu} placement="bottom-end">
        <Button
          size="sm"
          fill="text"
          icon="flask"
          variant="secondary"
          {...stylex.props(experimentalFeedbackButtonStyles.button)}
          tooltip={t('query-editor-next.experimental-button.tooltip', 'Experimental feature options')}
          aria-label={t('query-editor-next.experimental-button.aria-label', 'Experimental feature options')}
        />
      </Dropdown>
    </div>
  );
}

;

