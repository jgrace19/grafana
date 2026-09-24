import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { returnToPreviousStyles } from './ReturnToPrevious.stylex';
import { useCallback } from 'react';

import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';
import { locationService } from '@grafana/runtime';
import { useGrafana } from 'app/core/context/GrafanaContext';

import { DismissableButton } from './DismissableButton';

export interface ReturnToPreviousProps {
  title: string;
  href: string;
}

export const ReturnToPrevious = ({ href, title }: ReturnToPreviousProps) => {
  const { chrome } = useGrafana();

  const handleOnClick = useCallback(() => {
    locationService.push(href);
    chrome.clearReturnToPrevious('clicked');
  }, [href, chrome]);

  const handleOnDismiss = useCallback(() => {
    chrome.clearReturnToPrevious('dismissed');
  }, [chrome]);

  return (
    <div {...stylex.props(returnToPreviousStyles.returnToPrevious)} data-testid={selectors.components.ReturnToPrevious.buttonGroup}>
      <DismissableButton
        label={t('return-to-previous.button.label', 'Back to {{title}}', { title })}
        onClick={handleOnClick}
        onDismiss={handleOnDismiss}
      />
    </div>
  );
};

ReturnToPrevious.displayName = 'ReturnToPrevious';
