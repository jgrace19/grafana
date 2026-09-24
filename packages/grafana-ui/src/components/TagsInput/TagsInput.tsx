import * as stylex from '@stylexjs/stylex';
import { useCallback, useState, forwardRef } from 'react';
import * as React from 'react';

import { t, Trans } from '@grafana/i18n';

import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { spacing } from '../../themes/stylex/tokens.stylex';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { spacingValue } from '../Layout/utils/responsiveStylex';

import { TagItem } from './TagItem';

export interface Props {
  placeholder?: string;
  /** Array of selected tags */
  tags?: string[];
  onChange: (tags: string[]) => void;
  width?: number;
  id?: string;
  className?: string;
  /** Toggle disabled state */
  disabled?: boolean;
  /** Enable adding new tags when input loses focus */
  addOnBlur?: boolean;
  /** Toggle invalid state */
  invalid?: boolean;
  /** Colours the tags 'randomly' based on the name. Defaults to true */
  autoColors?: boolean;
}

/**
 * A set of an input field and a button next to it that allows the user to add new tags. The added tags are previewed next to the input and can be removed by clicking the "X" icon. You can customize the width of the input.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/inputs-tagsinput--docs
 */
export const TagsInput = forwardRef<HTMLInputElement, Props>(
  (
    {
      placeholder: placeholderProp,
      tags = [],
      onChange,
      width,
      className,
      disabled,
      addOnBlur,
      invalid,
      id,
      autoColors = true,
    },
    ref
  ) => {
    const placeholder = placeholderProp ?? t('grafana-ui.tags-input.placeholder-new-tag', 'New tag (enter key to add)');
    const [newTagName, setNewTagName] = useState('');
    const isTagTooLong = newTagName.length > 50;

    const onNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
      setNewTagName(event.target.value);
    }, []);

    const onRemove = (tagToRemove: string) => {
      onChange(tags.filter((x) => x !== tagToRemove));
    };

    const onAdd = (event?: React.MouseEvent | React.KeyboardEvent) => {
      event?.preventDefault();
      if (newTagName.length > 50) {
        return;
      }
      if (!tags.includes(newTagName)) {
        onChange(tags.concat(newTagName));
      }
      setNewTagName('');
    };

    const onBlur = () => {
      if (addOnBlur && newTagName) {
        onAdd();
      }
    };

    const onKeyboardAdd = (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' && newTagName !== '') {
        onAdd(event);
      }
    };

    return (
      <div
        {...mergeStylexProps(stylex.props(styles.wrapper, !!width && styles.width(spacingValue(width))), { className })}
      >
        <Input
          ref={ref}
          id={id}
          disabled={disabled}
          placeholder={placeholder}
          onChange={onNameChange}
          value={newTagName}
          onKeyDown={onKeyboardAdd}
          onBlur={onBlur}
          invalid={invalid || isTagTooLong}
          suffix={
            <Button
              fill="text"
              xstyle={styles.add}
              onClick={onAdd}
              size="md"
              disabled={newTagName.length <= 0 || isTagTooLong}
              title={
                isTagTooLong ? t('grafana-ui.tags-input.tag-too-long', 'Tag too long, max 50 characters') : undefined
              }
            >
              <Trans i18nKey="grafana-ui.tags-input.add">Add</Trans>
            </Button>
          }
        />
        {tags?.length > 0 && (
          <ul {...stylex.props(styles.tags)}>
            {tags.map((tag) => (
              <TagItem key={tag} name={tag} onRemove={onRemove} disabled={disabled} autoColors={autoColors} />
            ))}
          </ul>
        )}
      </div>
    );
  }
);

TagsInput.displayName = 'TagsInput';

const styles = stylex.create({
  add: {
    marginTop: 0,
    marginRight: `calc(${spacing['--gf-spacing-x1']} * -1)`,
    marginBottom: 0,
    marginLeft: `calc(${spacing['--gf-spacing-x1']} * -1)`,
  },
  wrapper: {
    minHeight: spacing['--gf-spacing-x4'],
    display: 'flex',
    flexDirection: 'column',
    gap: spacing['--gf-spacing-x1'],
    flexWrap: 'wrap',
  },
  width: (width: string) => ({
    width,
  }),
  tags: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    gap: spacing['--gf-spacing-x0-5'],
  },
});
