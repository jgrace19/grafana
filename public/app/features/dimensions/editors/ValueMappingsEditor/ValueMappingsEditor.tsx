// eslint-disable-next-line no-restricted-imports -- stylex: pending child migration, see the override below
import { css } from '@emotion/css';
import * as stylex from '@stylexjs/stylex';
import { memo, useCallback, useMemo, useState } from 'react';

import { MappingType, type StandardEditorProps, type ValueMapping } from '@grafana/data';
import { Trans, t } from '@grafana/i18n';
import { Stack, Icon, ColorPicker, Button, Modal } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

import { MediaType, ResourceFolderName, ResourcePickerSize } from '../../types';
import { ResourcePicker } from '../ResourcePicker';

import { buildEditRowModels, editModelToSaveModel, ValueMappingsEditorModal } from './ValueMappingsEditorModal';

export interface Props extends StandardEditorProps<ValueMapping[]> {
  showIcon?: boolean;
}

export const ValueMappingsEditor = memo((props: Props) => {
  const { value, onChange, item } = props;

  const showIconPicker = item.settings?.icon;
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const onCloseEditor = useCallback(() => {
    setIsEditorOpen(false);
  }, [setIsEditorOpen]);

  const rows = useMemo(() => buildEditRowModels(value), [value]);

  const onChangeColor = useCallback(
    (color: string, index: number) => {
      rows[index].result.color = color;
      onChange(editModelToSaveModel(rows));
    },
    [rows, onChange]
  );

  const onChangeIcon = useCallback(
    (icon: string | undefined, index: number) => {
      rows[index].result.icon = icon;
      onChange(editModelToSaveModel(rows));
    },
    [rows, onChange]
  );

  return (
    <Stack direction="column">
      <table {...stylex.props(styles.compactTable)}>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex.toString()}>
              <td {...stylex.props(styles.cell)}>
                {row.type === MappingType.ValueToText && row.key}
                {row.type === MappingType.RangeToText && (
                  <span>
                    [{row.from ?? '-∞'} - {row.to ?? '∞'}]
                  </span>
                )}
                {row.type === MappingType.RegexToText && row.pattern}
                {row.type === MappingType.SpecialValue && row.specialMatch}
              </td>
              <td {...stylex.props(styles.cell)}>
                <Icon name="arrow-right" />
              </td>
              <td {...stylex.props(styles.cell)}>{row.result.text}</td>
              {row.result.color && (
                <td {...stylex.props(styles.cell)}>
                  <ColorPicker
                    color={row.result.color}
                    onChange={(color) => onChangeColor(color, rowIndex)}
                    enableNamedColors={true}
                  />
                </td>
              )}
              {showIconPicker && row.result.icon && (
                <td {...stylex.props(styles.cell)} data-testid="iconPicker">
                  <ResourcePicker
                    onChange={(icon) => onChangeIcon(icon, rowIndex)}
                    value={row.result.icon}
                    size={ResourcePickerSize.SMALL}
                    folderName={ResourceFolderName.Icon}
                    mediaType={MediaType.Icon}
                    color={row.result.color}
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <Button variant="secondary" size="sm" fullWidth onClick={() => setIsEditorOpen(true)}>
        {rows.length > 0 && (
          <span>
            <Trans i18nKey="dimensions.value-mappings-editor.edit-value-mappings">Edit value mappings</Trans>
          </span>
        )}
        {rows.length === 0 && (
          <span>
            <Trans i18nKey="dimensions.value-mappings-editor.add-value-mappings">Add value mappings</Trans>
          </span>
        )}
      </Button>
      <Modal
        isOpen={isEditorOpen}
        title={t('dimensions.value-mappings-editor.title-value-mappings', 'Value mappings')}
        onDismiss={onCloseEditor}
        className={modalClassName}
        closeOnBackdropClick={false}
      >
        <ValueMappingsEditorModal
          value={value}
          onChange={onChange}
          onClose={onCloseEditor}
          showIconPicker={showIconPicker}
        />
      </Modal>
    </Stack>
  );
});

ValueMappingsEditor.displayName = 'ValueMappingsEditor';

// stylex: pending Modal migration: Modal's own width would beat a StyleX className
const modalClassName = css({
  width: '980px',
});

const styles = stylex.create({
  compactTable: {
    width: '100%',
  },
  cell: {
    paddingTop: spacing['--gf-spacing-x0-5'],
    paddingRight: spacing['--gf-spacing-x0-5'],
    paddingBottom: spacing['--gf-spacing-x0-5'],
    paddingLeft: spacing['--gf-spacing-x0-5'],
  },
});
