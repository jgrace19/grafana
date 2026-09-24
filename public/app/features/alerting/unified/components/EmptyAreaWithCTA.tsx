import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { emptyAreaWithCTAStyles } from './EmptyAreaWithCTA.stylex';
import { type ButtonHTMLAttributes } from 'react';

import { Button, type ButtonVariant, type IconName, LinkButton } from '@grafana/ui';

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
    className: stylex.props(formStyles.button),
    icon: buttonIcon,
    size: buttonSize,
    variant: buttonVariant,
  };

  return (
    <EmptyArea>
      <>
        <p {...stylex.props(emptyAreaWithCTAStyles.text)}>{text}</p>
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

