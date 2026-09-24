import * as stylex from '@stylexjs/stylex';

import { Trans, t } from '@grafana/i18n';
import { Input } from '@grafana/ui';
import { colors } from '@grafana/ui/stylex/tokens.stylex';
import './CustomAnnotationHeaderField.css';

interface CustomAnnotationHeaderFieldProps {
  field: { onChange: () => void; onBlur: () => void; value: string; name: string };
}

const CustomAnnotationHeaderField = ({ field }: CustomAnnotationHeaderFieldProps) => {
  return (
    <div>
      <span {...stylex.props(styles.annotationTitle)}>
        <Trans i18nKey="alerting.custom-annotation-header-field.custom-annotation-name-and-content">
          Custom annotation name and content
        </Trans>
      </span>
      <Input
        placeholder={t(
          'alerting.custom-annotation-header-field.placeholder-enter-custom-annotation-name',
          'Enter custom annotation name...'
        )}
        width={18}
        {...field}
        className="gf-alerting-custom-annotation-input"
      />
    </div>
  );
};

const styles = stylex.create({
  annotationTitle: {
    color: colors['--gf-colors-text-primary'],
    marginBottom: '3px',
  },
});

export default CustomAnnotationHeaderField;
