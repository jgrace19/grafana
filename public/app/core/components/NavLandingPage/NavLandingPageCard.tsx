import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { Card } from '@grafana/ui';
import { colors } from '@grafana/ui/stylex/tokens.stylex';

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
  const categoryStyle = category && isCategoryStyle(category) ? categoryStyles[category] : undefined;

  return (
    <Card noMargin xstyle={[styles.card, categoryStyle]} href={url} onClick={onClick}>
      <Card.Heading>{text}</Card.Heading>
      <Card.Description xstyle={styles.description}>{description}</Card.Description>
    </Card>
  );
}

const styles = stylex.create({
  card: {
    gridTemplateRows: '1fr 0 2fr',
  },
  // Limit descriptions to 3 lines max before ellipsing
  // Some plugin descriptions can be very long
  description: {
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    display: '-webkit-box',
    overflow: 'hidden',
  },
});

// Category-based styling. The :hover background replaces Card's own hover background.
const categoryStyles = stylex.create({
  primary: {
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: {
      default: colors['--gf-colors-primary-border-transparent'],
      ':hover': colors['--gf-colors-primary-border'],
    },
    backgroundColor: colors['--gf-colors-primary-transparent'],
  },
  secondary: {
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: {
      default: colors['--gf-colors-secondary-border-transparent'],
      ':hover': colors['--gf-colors-secondary-border'],
    },
    backgroundColor: colors['--gf-colors-secondary-transparent'],
  },
  success: {
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: {
      default: colors['--gf-colors-success-border-transparent'],
      ':hover': colors['--gf-colors-success-border'],
    },
    backgroundColor: colors['--gf-colors-success-transparent'],
  },
  warning: {
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: {
      default: colors['--gf-colors-warning-border-transparent'],
      ':hover': colors['--gf-colors-warning-border'],
    },
    backgroundColor: colors['--gf-colors-warning-transparent'],
  },
  error: {
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: {
      default: colors['--gf-colors-error-border-transparent'],
      ':hover': colors['--gf-colors-error-border'],
    },
    backgroundColor: colors['--gf-colors-error-transparent'],
  },
});
