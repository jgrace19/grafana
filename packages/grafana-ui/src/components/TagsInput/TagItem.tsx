import * as stylex from '@stylexjs/stylex';
import { useMemo } from 'react';

import { t } from '@grafana/i18n';

import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { colors, components, shape, spacing, typography } from '../../themes/stylex/tokens.stylex';
import { getTagColorsFromName } from '../../utils/tags';
import { IconButton } from '../IconButton/IconButton';

import './TagsInput.css';

interface Props {
  name: string;
  disabled?: boolean;
  onRemove: (tag: string) => void;

  /** Colours the tags 'randomly' based on the name. Defaults to true */
  autoColors?: boolean;
}

/**
 * @internal
 * Only used internally by TagsInput
 * */
export const TagItem = ({ name, disabled, onRemove, autoColors = true }: Props) => {
  // If configured, use random colors based on name.
  // Otherwise, a default class name will be applied to the tag.
  const tagStyle = useMemo(() => {
    if (autoColors) {
      const { color, borderColor } = getTagColorsFromName(name);
      return { backgroundColor: color, borderColor };
    }
    return undefined;
  }, [name, autoColors]);

  return (
    <li {...mergeStylexProps(stylex.props(styles.itemStyle, !tagStyle && styles.defaultTagColor), { style: tagStyle })}>
      <span {...stylex.props(styles.nameStyle)}>{name}</span>
      <IconButton
        name="times"
        size="lg"
        disabled={disabled}
        tooltip={t('grafana-ui.tags-input.remove', 'Remove tag: {{name}}', { name })}
        onClick={() => onRemove(name)}
        className="gf-tags-input-remove"
      />
    </li>
  );
};

const styles = stylex.create({
  itemStyle: {
    display: 'flex',
    gap: '3px',
    alignItems: 'center',
    height: `calc(${spacing['--gf-spacing-grid-size']} * 3)`,
    lineHeight: `calc(${spacing['--gf-spacing-grid-size']} * 3 - 2px)`,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: shape['--gf-shape-radius-default'],
    paddingTop: 0,
    paddingRight: spacing['--gf-spacing-x0-5'],
    paddingBottom: 0,
    paddingLeft: spacing['--gf-spacing-x0-5'],
    whiteSpace: 'nowrap',
    textShadow: 'none',
    fontWeight: 500,
    fontSize: typography['--gf-typography-size-sm'],
    color: '#fff',
  },
  defaultTagColor: {
    backgroundColor: colors['--gf-colors-background-secondary'],
    borderColor: components['--gf-components-input-border-color'],
    color: colors['--gf-colors-text-primary'],
  },
  nameStyle: {
    maxWidth: '25ch',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
});
