import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { closeButtonStyles } from './CloseButton.stylex';
import * as React from 'react';

import { t } from '@grafana/i18n';
import { IconButton } from '@grafana/ui';

type Props = {
  onClick: () => void;
  'aria-label'?: string;
  style?: React.CSSProperties;
};

export const CloseButton = ({ onClick, 'aria-label': ariaLabel, style }: Props) => {

  return (
    <IconButton
      aria-label={ariaLabel ?? 'Close'}
      {...stylex.props(closeButtonStyles.root)}
      name="times"
      onClick={onClick}
      style={style}
      tooltip={t('close-button.tooltip', 'Close')}
    />
  );
};

