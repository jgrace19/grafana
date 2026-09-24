import * as stylex from '@stylexjs/stylex';

import { renderMarkdown } from '@grafana/data';

import { useTheme2 } from '../../themes/ThemeContext';
import { colors, spacing, v1 } from '../../themes/stylex/tokens.stylex';
import { type CompletionItem } from '../../types/completion';

interface Props {
  item: CompletionItem;
  height: number;
}

export const TypeaheadInfo = ({ item, height }: Props) => {
  const visible = item && !!item.documentation;
  const label = item ? item.label : '';
  const documentation = renderMarkdown(item?.documentation);
  const theme = useTheme2();

  return (
    <div
      {...stylex.props(
        styles.typeaheadItem,
        visible === true ? styles.visible : styles.hidden,
        styles.minHeight(`${height + parseInt(theme.spacing(0.25), 10)}px`)
      )}
    >
      <b>{label}</b>
      <hr />
      <div dangerouslySetInnerHTML={{ __html: documentation }} />
    </div>
  );
};

const grid = spacing['--gf-spacing-grid-size'];

const styles = stylex.create({
  typeaheadItem: {
    zIndex: 11,
    paddingTop: grid,
    paddingRight: grid,
    paddingBottom: grid,
    paddingLeft: `calc(${grid} * 2)`,
    // `border: <color>` only sets the colour; the style stays none.
    borderColor: colors['--gf-colors-border-medium'],
    borderStyle: 'none',
    overflowY: 'scroll',
    overflowX: 'hidden',
    outlineStyle: 'none',
    backgroundColor: colors['--gf-colors-background-secondary'],
    color: colors['--gf-colors-text-secondary'],
    boxShadow: `0 0 20px ${v1['--gf-v1-palette-black']}`,
    width: '250px',
    position: 'relative',
    wordBreak: 'break-word',
  },
  visible: {
    visibility: 'visible',
  },
  hidden: {
    visibility: 'hidden',
  },
  minHeight: (minHeight: string) => ({ minHeight }),
});
