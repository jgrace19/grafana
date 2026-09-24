import * as stylex from '@stylexjs/stylex';
import { memo, type ChangeEvent } from 'react';

import { type VariableSuggestion, type DataLink } from '@grafana/data';
import { t, Trans } from '@grafana/i18n';

import { colors, spacing } from '../../themes/stylex/tokens.stylex';
import { Field } from '../Forms/Field';
import { Input } from '../Input/Input';
import { Switch } from '../Switch/Switch';

import { DataLinkInput } from './DataLinkInput';

interface DataLinkEditorProps {
  index: number;
  isLast: boolean;
  value: DataLink;
  suggestions: VariableSuggestion[];
  onChange: (index: number, link: DataLink, callback?: () => void) => void;
  showOneClick?: boolean;
}

export const DataLinkEditor = memo(
  ({ index, value, onChange, suggestions, isLast, showOneClick = false }: DataLinkEditorProps) => {
    const onUrlChange = (url: string, callback?: () => void) => {
      onChange(index, { ...value, url }, callback);
    };

    const onTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
      onChange(index, { ...value, title: event.target.value });
    };

    const onOpenInNewTabChanged = () => {
      onChange(index, { ...value, targetBlank: !value.targetBlank });
    };

    const onOneClickChanged = () => {
      onChange(index, { ...value, oneClick: !value.oneClick });
    };

    return (
      <div {...stylex.props(styles.listItem)}>
        <Field label={t('grafana-ui.data-link-editor.title-label', 'Title')}>
          <Input
            id="link-title"
            value={value.title}
            onChange={onTitleChange}
            placeholder={t('grafana-ui.data-link-editor.title-placeholder', 'Show details')}
          />
        </Field>

        <Field label={t('grafana-ui.data-link-editor.url-label', 'URL')}>
          <DataLinkInput value={value.url} onChange={onUrlChange} suggestions={suggestions} />
        </Field>

        <Field label={t('grafana-ui.data-link-editor.new-tab-label', 'Open in new tab')}>
          <Switch id="new-tab-toggle" value={value.targetBlank || false} onChange={onOpenInNewTabChanged} />
        </Field>

        {showOneClick && (
          <Field
            label={t('grafana-ui.data-link-inline-editor.one-click', 'One click')}
            description={t(
              'grafana-ui.data-link-editor-modal.one-click-description',
              'Only one link can have one click enabled at a time'
            )}
          >
            <Switch id="one-click-toggle" value={value.oneClick || false} onChange={onOneClickChanged} />
          </Field>
        )}

        {isLast && (
          <Trans i18nKey="grafana-ui.data-link-editor.info" className={stylex.props(styles.infoText).className}>
            With data links you can reference data variables like series name, labels and values. Type CMD+Space,
            CTRL+Space, or $ to open variable suggestions.
          </Trans>
        )}
      </div>
    );
  }
);

DataLinkEditor.displayName = 'DataLinkEditor';

const styles = stylex.create({
  listItem: {
    marginBottom: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
  },
  infoText: {
    paddingBottom: `calc(${spacing['--gf-spacing-grid-size']} * 2)`,
    marginLeft: '66px',
    color: colors['--gf-colors-text-secondary'],
  },
});
