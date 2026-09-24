import * as stylex from '@stylexjs/stylex';
import type { JSX } from 'react';

import { Input } from '@grafana/ui';

import { useShadowedState } from '../hooks/useShadowedState';

type Props = {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  isWide?: boolean;
  placeholder?: string;
};

export const InputSection = ({ value, onChange, isWide, placeholder }: Props): JSX.Element => {
  const [currentValue, setCurrentValue] = useShadowedState(value);

  const onBlur = () => {
    // we send empty-string as undefined
    const newValue = currentValue === '' ? undefined : currentValue;
    onChange(newValue);
  };

  return (
    <>
      <Input
        placeholder={placeholder}
        className={`${(isWide ?? false) ? 'width-14' : 'width-8'} ${stylex.props(styles.input).className}`}
        type="text"
        spellCheck={false}
        onBlur={onBlur}
        onChange={(e) => {
          setCurrentValue(e.currentTarget.value);
        }}
        value={currentValue ?? ''}
      />
    </>
  );
};

const styles = stylex.create({
  input: {
    paddingRight: '4px',
  },
});
