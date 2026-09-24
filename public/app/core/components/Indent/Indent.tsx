import * as React from 'react';

import { type ThemeSpacingTokens } from '@grafana/data';
import { type ResponsiveProp } from '@grafana/ui/internal';

import { themeSpacing } from '../../stylex/spacing';

interface IndentProps {
  children?: React.ReactNode;
  level: number;
  spacing: ResponsiveProp<ThemeSpacingTokens>;
}

function resolveSpacingToken(spacing: ResponsiveProp<ThemeSpacingTokens>): ThemeSpacingTokens {
  if (typeof spacing === 'object' && spacing !== null && 'xs' in spacing) {
    return spacing.xs;
  }
  return spacing as ThemeSpacingTokens;
}

export function Indent({ children, spacing, level }: IndentProps) {
  const token = resolveSpacingToken(spacing);
  const spacingMultiplier = token * level;

  return <span style={{ paddingLeft: themeSpacing(spacingMultiplier as ThemeSpacingTokens) }}>{children}</span>;
}
