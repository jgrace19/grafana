import * as stylex from '@stylexjs/stylex';
import { memo, useState, useCallback } from 'react';
import * as React from 'react';

import { type StandardEditorProps, type StringFieldConfigSettings } from '@grafana/data';
import { Button, Icon, Input } from '@grafana/ui';
import { colors, components } from '@grafana/ui/stylex/tokens.stylex';

type Props = StandardEditorProps<string[], StringFieldConfigSettings>;

export const StringArrayEditor = memo(({ value, onChange, item }: Props) => {
  const [showAdd, setShowAdd] = useState(false);

  const onRemoveString = useCallback(
    (index: number) => {
      const copy = [...value];
      copy.splice(index, 1);
      onChange(copy);
    },
    [value, onChange]
  );

  const onValueChange = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>, idx: number) => {
      if ('key' in e) {
        if (e.key !== 'Enter') {
          return;
        }
      }

      // Form event, or Enter
      const v = e.currentTarget.value.trim();
      if (idx < 0) {
        if (v) {
          e.currentTarget.value = ''; // reset last value
          onChange([...value, v]);
        }
        setShowAdd(false);
        return;
      }

      if (!v) {
        return onRemoveString(idx);
      }

      const copy = [...value];
      copy[idx] = v;
      onChange(copy);
    },
    [value, onChange, onRemoveString]
  );

  const placeholder = item.settings?.placeholder || 'Add text';

  return (
    <div>
      {value.map((v, index) => {
        return (
          <Input
            className={stylex.props(styles.textInput).className}
            key={`${index}/${v}`}
            defaultValue={v || ''}
            onBlur={(e) => onValueChange(e, index)}
            onKeyDown={(e) => onValueChange(e, index)}
            suffix={<Icon xstyle={styles.trashIcon} name="trash-alt" onClick={() => onRemoveString(index)} />}
          />
        );
      })}

      {showAdd ? (
        <Input
          autoFocus
          className={stylex.props(styles.textInput).className}
          placeholder={placeholder}
          defaultValue={''}
          onBlur={(e) => onValueChange(e, -1)}
          onKeyDown={(e) => onValueChange(e, -1)}
          suffix={<Icon name="plus-circle" />}
        />
      ) : (
        <Button icon="plus" size="sm" variant="secondary" onClick={() => setShowAdd(true)}>
          {placeholder}
        </Button>
      )}
    </div>
  );
});

StringArrayEditor.displayName = 'StringArrayEditor';

const styles = stylex.create({
  textInput: {
    marginBottom: '5px',
    borderWidth: { default: null, ':hover': '1px' },
    borderStyle: { default: null, ':hover': 'solid' },
    borderColor: { default: null, ':hover': components['--gf-components-input-border-hover'] },
  },
  trashIcon: {
    color: { default: colors['--gf-colors-text-secondary'], ':hover': colors['--gf-colors-text-primary'] },
    cursor: 'pointer',
  },
});
