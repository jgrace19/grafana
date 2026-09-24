import * as stylex from '@stylexjs/stylex';
import { annotationAvatarStyles } from './AnnotationAvatar.stylex';

interface Props {
  src: string | undefined;
}

export function AnnotationAvatar({ src }: Props) {
  return src && <img {...stylex.props(annotationAvatarStyles.avatar)} alt="Annotation avatar" src={textUtil.sanitizeUrl(src)} />;
}

;
