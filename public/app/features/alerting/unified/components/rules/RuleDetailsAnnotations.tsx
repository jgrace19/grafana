import * as stylex from '@stylexjs/stylex';
import type { JSX } from 'react';

import { useAnnotationLinks } from '../../utils/annotations';
import { AnnotationDetailsField } from '../AnnotationDetailsField';

type Props = {
  annotations: Array<[string, string]>;
};

export function RuleDetailsAnnotations(props: Props): JSX.Element | null {
  const { annotations } = props;
  const annotationLinks = useAnnotationLinks(annotations);

  if (annotations.length === 0) {
    return null;
  }

  return (
    <div {...stylex.props(styles.annotations)}>
      {annotations.map(([key, value]) => (
        <AnnotationDetailsField key={key} annotationKey={key} value={value} valueLink={annotationLinks.get(key)} />
      ))}
    </div>
  );
}

const styles = stylex.create({
  annotations: {
    marginTop: '46px',
  },
});
