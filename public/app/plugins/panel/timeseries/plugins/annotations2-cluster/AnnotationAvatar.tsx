import * as stylex from '@stylexjs/stylex';

import { textUtil } from '@grafana/data';
import { shape, spacing } from '@grafana/ui/stylex/tokens.stylex';

interface Props {
  src: string | undefined;
}

export function AnnotationAvatar({ src }: Props) {
  return src && <img {...stylex.props(styles.avatar)} alt="Annotation avatar" src={textUtil.sanitizeUrl(src)} />;
}

const styles = stylex.create({
  avatar: {
    borderRadius: shape['--gf-shape-radius-circle'],
    width: spacing['--gf-spacing-x4'],
    height: spacing['--gf-spacing-x4'],
    marginRight: spacing['--gf-spacing-x1'],
  },
});
