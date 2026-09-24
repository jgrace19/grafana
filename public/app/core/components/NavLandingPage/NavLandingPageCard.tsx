import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { navLandingPageCardStyles } from './NavLandingPageCard.stylex';
import * as React from 'react';

import { Card } from '@grafana/ui';

interface Props {
  description?: string;
  text: string;
  url: string;
  category?: string;
  onClick?: (event?: React.MouseEvent) => void;
}

const CATEGORY_STYLES = ['primary', 'secondary', 'success', 'warning', 'error'] as const;
type CategoryStyle = (typeof CATEGORY_STYLES)[number];

function isCategoryStyle(cat: string): cat is CategoryStyle {
  return CATEGORY_STYLES.some((style) => style === cat);
}

export function NavLandingPageCard({ description, text, url, category, onClick }: Props) {

  const categoryClass = category && isCategoryStyle(category) ? styles[category] : undefined;

  return (
    <Card noMargin {...mergeStylexClassName(stylex.props(navLandingPageCardStyles.card, categoryClass), undefined)} href={url} onClick={onClick}>
      <Card.Heading>{text}</Card.Heading>
      <Card.Description {...stylex.props(navLandingPageCardStyles.description)}>{description}</Card.Description>
    </Card>
  );
}

