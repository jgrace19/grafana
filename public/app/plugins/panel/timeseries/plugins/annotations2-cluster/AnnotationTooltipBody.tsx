import * as stylex from '@stylexjs/stylex';
import { annotationTooltipBodyStyles } from './AnnotationTooltipBody.stylex';

import { Stack, Tag } from '@grafana/ui';

export function AnnotationTooltipBody({
  text,
  title,
  alertText,
  tags,
}: {
  title?: string | null;
  text: string;
  alertText: string;
  tags: string[];
}) {
  return (
    <div {...stylex.props(annotationTooltipBodyStyles.body)}>
      {title && <div dangerouslySetInnerHTML={{ __html: textUtil.sanitize(title) }}></div>}
      {text && <div {...stylex.props(annotationTooltipBodyStyles.text)} dangerouslySetInnerHTML={{ __html: textUtil.sanitize(text) }} />}
      {alertText}
      <div>
        <Stack gap={0.5} wrap={true}>
          {tags.map((t, i) => (
            <Tag data-testid={'annotation-tag'} name={t} key={`${t}-${i}`} />
          ))}
        </Stack>
      </div>
    </div>
  );
}

