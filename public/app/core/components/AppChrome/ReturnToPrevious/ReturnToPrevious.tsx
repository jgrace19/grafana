import * as stylex from '@stylexjs/stylex';
import { useCallback } from 'react';

import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';
import { locationService } from '@grafana/runtime';
import { zIndex } from '@grafana/ui/stylex/constants.stylex';
import { shadows, spacing } from '@grafana/ui/stylex/tokens.stylex';
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
    <div {...stylex.props(styles.returnToPrevious)} data-testid={selectors.components.ReturnToPrevious.buttonGroup}>
      <DismissableButton
        label={t('return-to-previous.button.label', 'Back to {{title}}', { title })}
        onClick={handleOnClick}
        onDismiss={handleOnDismiss}
      />
    </div>
  );
};
const styles = stylex.create({
  returnToPrevious: {
    display: 'flex',
    justifyContent: 'center',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: zIndex.tooltip,
    position: 'fixed',
    bottom: spacing['--gf-spacing-x4'],
    boxShadow: shadows['--gf-shadows-z3'],
  },
});

ReturnToPrevious.displayName = 'ReturnToPrevious';
