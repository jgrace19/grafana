import { type GrafanaTheme2 } from '@grafana/data';
import type { CSSProperties } from 'react';

export function getCardBorderGradient(theme: GrafanaTheme2, complete: boolean): string {
  const completeGradient = 'linear-gradient(to right, #5182CC 0%, #245BAF 100%)';
  const darkThemeGradients = complete ? completeGradient : 'linear-gradient(to right, #f05a28 0%, #fbca0a 100%)';
  const lightThemeGradients = complete ? completeGradient : 'linear-gradient(to right, #FBCA0A 0%, #F05A28 100%)';
  return theme.isDark ? darkThemeGradients : lightThemeGradients;
}

export function getCardStyleProps(theme: GrafanaTheme2, complete: boolean): CSSProperties {
  return {
    backgroundColor: theme.colors.background.secondary,
    marginRight: theme.spacing(4),
    border: `1px solid ${theme.colors.border.weak}`,
    borderBottomLeftRadius: theme.shape.borderRadius(2),
    borderBottomRightRadius: theme.shape.borderRadius(2),
    position: 'relative',
    maxHeight: '230px',
  };
}

export function getCardAccentStyle(theme: GrafanaTheme2, complete: boolean): CSSProperties {
  return {
    display: 'block',
    position: 'absolute',
    left: 0,
    right: 0,
    height: '2px',
    top: 0,
    backgroundImage: getCardBorderGradient(theme, complete),
  };
}
