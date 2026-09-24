// Core Grafana history https://github.com/grafana/grafana/blob/v11.0.0-preview/public/app/plugins/datasource/prometheus/querybuilder/shared/RawQuery.tsx
import clsx from 'clsx';
import Prism, { type Grammar } from 'prismjs';
import * as stylex from '@stylexjs/stylex';

import { t } from '@grafana/i18n';
import { mergeStylexClassName } from '@grafana/ui/unstable';

import { rawQueryStyles } from './RawQuery.stylex';

interface Props {
  query: string;
  lang: {
    grammar: Grammar;
    name: string;
  };
  className?: string;
}

export function RawQuery({ query, lang, className }: Props) {
  const highlighted = Prism.highlight(query, lang.grammar, lang.name);
  const fieldProps = mergeStylexClassName(stylex.props(rawQueryStyles.editorField), className);

  return (
    <div
      {...fieldProps}
      className={clsx(fieldProps.className, 'prism-syntax-highlight')}
      aria-label={t('grafana-prometheus.querybuilder.raw-query.aria-label-selector', 'selector')}
      dangerouslySetInnerHTML={{ __html: highlighted }}
    />
  );
}
