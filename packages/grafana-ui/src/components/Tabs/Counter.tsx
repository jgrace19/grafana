import { locale } from '@grafana/data';

import { counterStyleProps } from './Counter.stylex';

type CounterVariant = 'primary' | 'secondary';
export interface CounterProps {
  value: number;
  variant?: CounterVariant;
}

export const Counter = ({ value, variant = 'secondary' }: CounterProps) => {
  const styleKey = variant === 'primary' ? 'counterPrimary' : 'counterSecondary';
  return <span {...counterStyleProps(styleKey)}>{locale(value, 0).text}</span>;
};
