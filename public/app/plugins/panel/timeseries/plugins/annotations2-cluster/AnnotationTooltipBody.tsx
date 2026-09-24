import * as stylex from '@stylexjs/stylex';

import { textUtil } from '@grafana/data';
import { Stack, Tag } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { colors, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

import './AnnotationTooltipBody.css';

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
    <div {...mergeStylexProps(stylex.props(styles.body), { className: 'gf-annotation-tooltip-body' })}>
      {title && <div dangerouslySetInnerHTML={{ __html: textUtil.sanitize(title) }}></div>}
      {text && <div {...stylex.props(styles.text)} dangerouslySetInnerHTML={{ __html: textUtil.sanitize(text) }} />}
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

const styles = stylex.create({
  body: {
    padding: spacing['--gf-spacing-x1'],
    fontSize: typography['--gf-typography-body-small-font-size'],
    color: colors['--gf-colors-text-secondary'],
    fontWeight: 400,
  },
  text: {
    paddingBottom: spacing['--gf-spacing-x1'],
  },
});
