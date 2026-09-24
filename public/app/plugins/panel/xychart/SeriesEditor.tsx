import * as stylex from '@stylexjs/stylex';
import { Fragment, useId, useState } from 'react';
import { usePrevious } from 'react-use';

import {
  getFrameDisplayName,
  type StandardEditorProps,
  // getFieldDisplayName,
  FrameMatcherID,
  FieldMatcherID,
  FieldNamePickerBaseNameMode,
  FieldType,
} from '@grafana/data';
import { Trans, t } from '@grafana/i18n';
import { Button, Field, IconButton, Select } from '@grafana/ui';
import { FieldNamePicker } from '@grafana/ui/internal';
import { colors, components, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';
import { LayerName } from 'app/core/components/Layers/LayerName';

import { type Options, SeriesMapping, type XYSeriesConfig } from './panelcfg.gen';
import './SeriesEditor.css';

export const SeriesEditor = ({
  value: seriesCfg,
  onChange,
  context,
}: StandardEditorProps<XYSeriesConfig[], unknown, Options>) => {
  // reset opts when mapping changes (no way to do this in panel opts builder?)
  const mapping = context.options?.mapping;
  const prevMapping = usePrevious(mapping);
  const mappingChanged = prevMapping != null && mapping !== prevMapping;

  const defaultFrame = { frame: { matcher: { id: FrameMatcherID.byIndex, options: 0 } } };
  const [selectedIdx, setSelectedIdx] = useState(0);

  if (mappingChanged || seriesCfg == null) {
    seriesCfg = [{ ...defaultFrame }];
    onChange([...seriesCfg]);

    if (selectedIdx > 0) {
      setSelectedIdx(0);
    }
  }

  const addSeries = () => {
    seriesCfg = seriesCfg.concat({ ...defaultFrame });
    setSelectedIdx(seriesCfg.length - 1);
    onChange([...seriesCfg]);
  };

  const deleteSeries = (index: number) => {
    seriesCfg = seriesCfg.filter((s, i) => i !== index);
    setSelectedIdx(0);
    onChange([...seriesCfg]);
  };

  const series = seriesCfg[selectedIdx];
  const formKey = `${mapping}${selectedIdx}`;

  const baseNameMode =
    mapping === SeriesMapping.Manual
      ? FieldNamePickerBaseNameMode.ExcludeBaseNames
      : context.data.length === 1
        ? FieldNamePickerBaseNameMode.IncludeAll
        : FieldNamePickerBaseNameMode.OnlyBaseNames;

  context.data.forEach((frame, frameIndex) => {
    frame.fields.forEach((field, fieldIndex) => {
      field.state = {
        ...field.state,
        origin: {
          frameIndex,
          fieldIndex,
        },
      };
    });
  });

  const frameInputId = useId();
  const xFieldInputId = useId();
  const yFieldInputId = useId();
  const sizeFieldInputId = useId();
  const colorFieldInputId = useId();

  return (
    <>
      {mapping === SeriesMapping.Manual && (
        <>
          <Button
            icon="plus"
            size="sm"
            variant="secondary"
            onClick={addSeries}
            className={stylex.props(styles.marginBot).className}
          >
            <Trans i18nKey="xychart.series-editor.add-series">Add series</Trans>
          </Button>

          <div {...stylex.props(styles.marginBot)}>
            {seriesCfg.map((series, index) => {
              return (
                <div
                  key={`series/${index}`}
                  {...stylex.props(styles.row, index === selectedIdx && styles.sel)}
                  onClick={() => setSelectedIdx(index)}
                  role="button"
                  aria-label={t('xychart.series-editor.aria-label-select-series', 'Select series {{seriesNum}}', {
                    seriesNum: index + 1,
                  })}
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      setSelectedIdx(index);
                    }
                  }}
                >
                  <LayerName
                    name={series.name?.fixed ?? `Series ${index + 1}`}
                    onChange={(v) => {
                      series.name = {
                        fixed: v === '' || v === `Series ${index + 1}` ? undefined : v,
                      };
                      onChange([...seriesCfg]);
                    }}
                  />
                  <IconButton
                    name="trash-alt"
                    className="gf-xychart-series-action-icon"
                    onClick={() => deleteSeries(index)}
                    tooltip={t('xychart.series-editor.tooltip-delete-series', 'Delete series')}
                  />
                </div>
              );
            })}
          </div>
        </>
      )}

      {selectedIdx >= 0 && series != null && (
        <Fragment key={formKey}>
          <Field label={t('xychart.series-editor.label-frame', 'Frame')}>
            <Select
              inputId={frameInputId}
              placeholder={
                mapping === SeriesMapping.Auto
                  ? t('xychart.series-editor.placeholder-all-frames', 'All frames')
                  : t('xychart.series-editor.placeholder-select-frame', 'Select frame')
              }
              isClearable={true}
              options={context.data.map((frame, index) => ({
                value: index,
                label: `${getFrameDisplayName(frame, index)} (index: ${index}, rows: ${frame.length})`,
              }))}
              value={series.frame?.matcher.options}
              onChange={(opt) => {
                if (opt == null) {
                  delete series.frame;
                } else {
                  series.frame = {
                    matcher: {
                      id: FrameMatcherID.byIndex,
                      options: Number(opt.value),
                    },
                  };
                }

                onChange([...seriesCfg]);
              }}
            />
          </Field>
          <Field label={t('xychart.series-editor.label-x-field', 'X field')}>
            <FieldNamePicker
              id={xFieldInputId}
              value={series.x?.matcher.options as string}
              context={context}
              onChange={(fieldName) => {
                if (fieldName == null) {
                  delete series.x;
                } else {
                  // TODO: reset any other dim that was set to fieldName
                  series.x = {
                    matcher: {
                      id: FieldMatcherID.byName,
                      options: fieldName,
                    },
                  };
                }

                onChange([...seriesCfg]);
              }}
              item={{
                id: 'x',
                name: 'x',
                settings: {
                  filter: (field) =>
                    (mapping === SeriesMapping.Auto ||
                      field.state?.origin?.frameIndex === series.frame?.matcher.options) &&
                    (field.type === FieldType.number || field.type === FieldType.time) &&
                    !field.config.custom?.hideFrom?.viz,
                  baseNameMode,
                  placeholderText:
                    mapping === SeriesMapping.Auto
                      ? t('xychart.series-editor.placeholder-x-field', 'First number or time field in each frame')
                      : undefined,
                },
              }}
            />
          </Field>
          <Field label={t('xychart.series-editor.label-y-field', 'Y field')}>
            <FieldNamePicker
              id={yFieldInputId}
              value={series.y?.matcher?.options as string}
              context={context}
              onChange={(fieldName) => {
                if (fieldName == null) {
                  delete series.y;
                } else {
                  // TODO: reset any other dim that was set to fieldName
                  series.y = {
                    matcher: {
                      id: FieldMatcherID.byName,
                      options: fieldName,
                    },
                  };
                }

                onChange([...seriesCfg]);
              }}
              item={{
                id: 'y',
                name: 'y',
                settings: {
                  // TODO: filter out series.y?.exclude.options, series.size.matcher.options, series.color.matcher.options
                  filter: (field) =>
                    (mapping === SeriesMapping.Auto ||
                      field.state?.origin?.frameIndex === series.frame?.matcher.options) &&
                    field.type === FieldType.number &&
                    !field.config.custom?.hideFrom?.viz,
                  baseNameMode,
                  placeholderText:
                    mapping === SeriesMapping.Auto
                      ? t('xychart.series-editor.placeholder-y-field', 'Remaining number fields in each frame')
                      : undefined,
                },
              }}
            />
          </Field>
          <Field label={t('xychart.series-editor.label-size-field', 'Size field')}>
            <FieldNamePicker
              id={sizeFieldInputId}
              value={series.size?.matcher?.options as string}
              context={context}
              onChange={(fieldName) => {
                if (fieldName == null) {
                  delete series.size;
                } else {
                  // TODO: reset any other dim that was set to fieldName
                  series.size = {
                    matcher: {
                      id: FieldMatcherID.byName,
                      options: fieldName,
                    },
                  };
                }

                onChange([...seriesCfg]);
              }}
              item={{
                id: 'size',
                name: 'size',
                settings: {
                  // TODO: filter out series.y?.exclude.options, series.size.matcher.options, series.color.matcher.options
                  filter: (field) =>
                    (mapping === SeriesMapping.Auto ||
                      field.state?.origin?.frameIndex === series.frame?.matcher.options) &&
                    field.type === FieldType.number &&
                    !field.config.custom?.hideFrom?.viz,
                  baseNameMode,
                  placeholderText: '',
                },
              }}
            />
          </Field>
          <Field label={t('xychart.series-editor.label-color-field', 'Color field')}>
            <FieldNamePicker
              id={colorFieldInputId}
              value={series.color?.matcher?.options as string}
              context={context}
              onChange={(fieldName) => {
                if (fieldName == null) {
                  delete series.color;
                } else {
                  // TODO: reset any other dim that was set to fieldName
                  series.color = {
                    matcher: {
                      id: FieldMatcherID.byName,
                      options: fieldName,
                    },
                  };
                }

                onChange([...seriesCfg]);
              }}
              item={{
                id: 'color',
                name: 'color',
                settings: {
                  // TODO: filter out series.y?.exclude.options, series.size.matcher.options, series.color.matcher.options
                  filter: (field) =>
                    (mapping === SeriesMapping.Auto ||
                      field.state?.origin?.frameIndex === series.frame?.matcher.options) &&
                    field.type === FieldType.number &&
                    !field.config.custom?.hideFrom?.viz,
                  baseNameMode,
                  placeholderText: '',
                },
              }}
            />
          </Field>
        </Fragment>
      )}
    </>
  );
};

const styles = stylex.create({
  marginBot: {
    marginBottom: '20px',
  },
  row: {
    paddingTop: spacing['--gf-spacing-x0-5'],
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x0-5'],
    paddingLeft: spacing['--gf-spacing-x1'],
    borderRadius: shape['--gf-shape-radius-default'],
    backgroundColor: colors['--gf-colors-background-secondary'],
    minHeight: spacing['--gf-spacing-x4'],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '3px',
    cursor: 'pointer',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: {
      default: components['--gf-components-input-border-color'],
      ':hover': components['--gf-components-input-border-hover'],
    },
  },
  sel: {
    borderColor: colors['--gf-colors-primary-border'],
  },
});
