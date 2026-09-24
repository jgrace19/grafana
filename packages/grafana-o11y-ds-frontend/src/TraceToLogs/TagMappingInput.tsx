import * as stylex from '@stylexjs/stylex';

import { InlineLabel, SegmentInput, ToolbarButton } from '@grafana/ui';
import { mergeStylexClassName } from '@grafana/ui/unstable';

import { tagMappingStyles } from './TagMappingInput.stylex';
import { type TraceToLogsTag } from './TraceToLogsSettings';

interface Props {
  values: TraceToLogsTag[];
  onChange: (values: TraceToLogsTag[]) => void;
  id?: string;
}

export const TagMappingInput = ({ values, onChange, id }: Props) => {
  return (
    <div {...stylex.props(tagMappingStyles.wrapper)}>
      {values.length ? (
        values.map((value, idx) => (
          <div {...stylex.props(tagMappingStyles.pair)} key={idx}>
            <SegmentInput
              id={`${id}-key-${idx}`}
              placeholder={'Tag name'}
              value={value.key}
              onChange={(e) => {
                onChange(
                  values.map((v, i) => {
                    if (i === idx) {
                      return { ...v, key: String(e) };
                    }
                    return v;
                  })
                );
              }}
            />
            <InlineLabel
              aria-label="equals"
              className={mergeStylexClassName(stylex.props(tagMappingStyles.operator)).className}
            >
              as
            </InlineLabel>
            <SegmentInput
              id={`${id}-value-${idx}`}
              placeholder={'New name (optional)'}
              value={value.value || ''}
              onChange={(e) => {
                onChange(
                  values.map((v, i) => {
                    if (i === idx) {
                      return { ...v, value: String(e) };
                    }
                    return v;
                  })
                );
              }}
            />
            <ToolbarButton
              onClick={() => onChange([...values.slice(0, idx), ...values.slice(idx + 1)])}
              className={mergeStylexClassName(stylex.props(tagMappingStyles.removeTag), 'query-part').className}
              aria-label="Remove tag"
              type="button"
              icon="times"
            />

            {idx === values.length - 1 ? (
              <ToolbarButton
                onClick={() => onChange([...values, { key: '', value: '' }])}
                className="query-part"
                aria-label="Add tag"
                type="button"
                icon="plus"
              />
            ) : null}
          </div>
        ))
      ) : (
        <ToolbarButton
          icon="plus"
          onClick={() => onChange([...values, { key: '', value: '' }])}
          className="query-part"
          aria-label="Add tag"
          type="button"
        />
      )}
    </div>
  );
};
