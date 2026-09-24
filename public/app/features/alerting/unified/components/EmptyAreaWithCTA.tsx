import * as stylex from '@stylexjs/stylex';
import { type ButtonHTMLAttributes } from 'react';

import { Button, type ButtonVariant, type IconName, LinkButton } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

import { EmptyArea } from './EmptyArea';

export interface EmptyAreaWithCTAProps {
  buttonLabel: string;
  href?: string;
  onButtonClick?: ButtonHTMLAttributes<HTMLButtonElement>['onClick'];
  text: string;

  buttonIcon?: IconName;
  buttonSize?: 'xs' | 'sm' | 'md' | 'lg';
  buttonVariant?: ButtonVariant;
  showButton?: boolean;
}

export const EmptyAreaWithCTA = ({
  buttonIcon,
  buttonLabel,
  buttonSize = 'lg',
  buttonVariant = 'primary',
  onButtonClick,
  text,
  href,
  showButton = true,
}: EmptyAreaWithCTAProps) => {
  const commonProps = {
    className: stylex.props(styles.button).className,
    icon: buttonIcon,
    size: buttonSize,
    variant: buttonVariant,
  };

  return (
    <EmptyArea>
      <>
        <p {...stylex.props(styles.text)}>{text}</p>
        {showButton &&
          (href ? (
            <LinkButton href={href} type="button" {...commonProps}>
              {buttonLabel}
            </LinkButton>
          ) : (
            <Button onClick={onButtonClick} type="button" {...commonProps}>
              {buttonLabel}
            </Button>
          ))}
      </>
    </EmptyArea>
  );
};

const styles = stylex.create({
  text: {
    marginBottom: spacing['--gf-spacing-x2'],
  },
  button: {
    marginTop: spacing['--gf-spacing-x2'],
    marginRight: 0,
    marginBottom: spacing['--gf-spacing-x1'],
    marginLeft: 0,
  },
});
