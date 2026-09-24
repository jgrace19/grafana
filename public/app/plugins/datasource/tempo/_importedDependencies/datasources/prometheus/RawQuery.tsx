import * as stylex from '@stylexjs/stylex';
import { rawQueryStyles } from './RawQuery.stylex';

import Prism, { type Grammar } from 'prismjs';

import { useTheme2 } from '@grafana/ui';

export interface Props {
  query: string;
  lang: {
    grammar: Grammar;
    name: string;
  };
  className?: string;
}
export function RawQuery({ query, lang, className }: Props) {
  const theme = useTheme2();
  const styles = getStyles(theme);
  const highlighted = Prism.highlight(query, lang.grammar, lang.name);

  return (
    <div
      className={mergeStylexClassName(stylex.props(rawQueryStyles.editorField), clsx( 'prism-syntax-highlight', className)}
      aria-label="selector"
      dangerouslySetInnerHTML={{ __html: highlighted }}
    />
  );
}

;
