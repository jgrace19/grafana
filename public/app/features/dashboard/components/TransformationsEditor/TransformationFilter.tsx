import * as stylex from '@stylexjs/stylex';
import { useMemo } from 'react';

import { type DataFrame, type DataTransformerConfig } from '@grafana/data';
import { t } from '@grafana/i18n';
import { DataTopic } from '@grafana/schema';
import { Field, Select } from '@grafana/ui';
import { colors, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';
import { FrameMultiSelectionEditor } from 'app/plugins/panel/geomap/editor/FrameSelectionEditor';

interface TransformationFilterProps {
  /** data frames from the output of previous transformation */
  data: DataFrame[];
  index: number;
  config: DataTransformerConfig;
  annotations?: DataFrame[];
  onChange: (index: number, config: DataTransformerConfig) => void;
}

export const TransformationFilter = ({ index, annotations, config, onChange, data }: TransformationFilterProps) => {
  const opts = useMemo(() => {
    return {
      // eslint-disable-next-line
      context: { data },
      showTopic: true || annotations?.length || config.topic?.length,
      showFilter: config.topic !== DataTopic.Annotations,
      source: [
        { value: DataTopic.Series, label: `Query and Transformation results` },
        { value: DataTopic.Annotations, label: `Annotation data` },
      ],
    };
  }, [data, annotations?.length, config.topic]);

  return (
    <div {...stylex.props(styles.wrapper)}>
      <Field label={t('dashboard.transformation-filter.label-apply-transformation-to', 'Apply transformation to')}>
        <>
          {opts.showTopic && (
            <Select
              isClearable={true}
              options={opts.source}
              value={opts.source.find((v) => v.value === config.topic)}
              placeholder={opts.source[0].label}
              className={stylex.props(styles.padded).className}
              onChange={(option) => {
                onChange(index, {
                  ...config,
                  topic: option?.value,
                });
              }}
            />
          )}
          {opts.showFilter && (
            <FrameMultiSelectionEditor
              value={config.filter!}
              context={opts.context}
              onChange={(filter) => onChange(index, { ...config, filter })}
            />
          )}
        </>
      </Field>
    </div>
  );
};

const styles = stylex.create({
  wrapper: {
    padding: spacing['--gf-spacing-x2'],
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-background-secondary'],
    borderTopStyle: 'none',
    borderTopLeftRadius: 'unset',
    borderTopRightRadius: 'unset',
    borderBottomRightRadius: shape['--gf-shape-radius-default'],
    borderBottomLeftRadius: shape['--gf-shape-radius-default'],
    position: 'relative',
    top: '-4px',
  },
  padded: {
    marginBottom: spacing['--gf-spacing-x1'],
  },
});
