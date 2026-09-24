import { css, cx } from '@emotion/css';
import { colorManipulator, type PanelProps } from '@grafana/data';
import { Badge, useStyles2, useTheme2 } from '@grafana/ui';
import React from 'react';

import { CompatPanelOptions } from '../types';

const getStyles = () => ({
  host: css`
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  `,
  badgeOverride: css`
    outline: 2px solid var(--override-outline, magenta);
    outline-offset: 2px;
  `,
});

export const UseStyles2CompatPanel: React.FC<PanelProps<CompatPanelOptions>> = ({ width, height }) => {
  const theme = useTheme2();
  const styles = useStyles2(getStyles);
  const derivedTextColor = colorManipulator.darken(theme.colors.primary.text, 0.15);

  return (
    <div
      className={styles.host}
      style={{ width, height }}
      data-testid="usestyles2-compat-host"
    >
      <Badge
        text="Plugin compat"
        color="blue"
        className={cx(styles.badgeOverride)}
        data-testid="usestyles2-compat-badge"
      />
      <span data-testid="usestyles2-compat-theme-color" style={{ color: derivedTextColor }}>
        Theme-derived color
      </span>
    </div>
  );
};
