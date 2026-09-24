import * as stylex from '@stylexjs/stylex';
import { type OptionProps } from 'react-select';

import { t } from '@grafana/i18n';
import { mergeStylexProps } from '@grafana/ui/internal';
import { colors, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';

import { TagBadge } from './TagBadge';

export interface TagSelectOption {
  value: string;
  label: string;
  count: number;
}

export const TagOption = ({ data, className, label, isFocused, innerProps }: OptionProps<TagSelectOption>) => {
  return (
    <div
      {...stylex.props(styles.option, isFocused && styles.optionFocused)}
      aria-label={t('tag-filter.tag-option-label', 'Tag option')}
      {...innerProps}
    >
      <div {...mergeStylexProps(stylex.props(styles.optionInner), { className })}>
        {typeof label === 'string' ? <TagBadge label={label} removeIcon={false} count={data.count ?? 0} /> : label}
      </div>
    </div>
  );
};

const styles = stylex.create({
  option: {
    paddingTop: spacing['--gf-spacing-x0-5'],
    paddingRight: spacing['--gf-spacing-x0-5'],
    paddingBottom: spacing['--gf-spacing-x0-5'],
    paddingLeft: spacing['--gf-spacing-x0-5'],
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    borderLeftWidth: '2px',
    borderLeftStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRadius: shape['--gf-shape-radius-default'],
    backgroundColor: { default: null, ':hover': colors['--gf-colors-action-hover'] },
  },
  optionFocused: {
    backgroundColor: { default: colors['--gf-colors-action-focus'], ':hover': colors['--gf-colors-action-hover'] },
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopStyle: 'none',
    borderRightStyle: 'none',
    borderBottomStyle: 'none',
  },
  optionInner: {
    position: 'relative',
    textAlign: 'left',
    width: '100%',
    display: 'block',
    cursor: 'pointer',
    paddingTop: '2px',
    paddingRight: 0,
    paddingBottom: '2px',
    paddingLeft: 0,
  },
});
