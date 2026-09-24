import * as React from 'react';

import { t } from '@grafana/i18n';
import { IconButton, useTheme2 } from '@grafana/ui';

type Props = {
  onClick: () => void;
  'aria-label'?: string;
  style?: React.CSSProperties;
};

export const CloseButton = ({ onClick, 'aria-label': ariaLabel, style }: Props) => {
  const theme = useTheme2();

  return (
    <IconButton
      aria-label={ariaLabel ?? 'Close'}
      name="times"
      onClick={onClick}
      // IconButton has no `xstyle`, and its own `position: relative` beats a StyleX class passed as `className`.
      style={{ position: 'absolute', right: theme.spacing(0.5), top: theme.spacing(1), ...style }}
      tooltip={t('close-button.tooltip', 'Close')}
    />
  );
};
