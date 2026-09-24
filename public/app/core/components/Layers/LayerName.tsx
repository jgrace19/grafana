import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { layerNameStyles } from './LayerName.stylex';
import { useState } from 'react';
import * as React from 'react';

import { t } from '@grafana/i18n';
import { Icon, Input, FieldValidationMessage } from '@grafana/ui';

export interface LayerNameProps {
  name: string;
  onChange: (v: string) => void;
  verifyLayerNameUniqueness?: (nameToCheck: string) => boolean;
  overrideStyles?: boolean;
}

export const LayerName = ({ name, onChange, verifyLayerNameUniqueness, overrideStyles }: LayerNameProps) => {

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const onEditLayer = (event: React.SyntheticEvent) => {
    setIsEditing(true);
  };

  const onEndEditName = (newName: string) => {
    setIsEditing(false);

    if (validationError) {
      setValidationError(null);
      return;
    }

    if (name !== newName) {
      onChange(newName);
    }
  };

  const onInputChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const newName = event.currentTarget.value.trim();

    if (newName.length === 0) {
      setValidationError('An empty layer name is not allowed');
      return;
    }

    if (verifyLayerNameUniqueness && !verifyLayerNameUniqueness(newName) && newName !== name) {
      setValidationError('Layer name already exists');
      return;
    }

    if (validationError) {
      setValidationError(null);
    }
  };

  const onEditLayerBlur = (event: React.SyntheticEvent<HTMLInputElement>) => {
    onEndEditName(event.currentTarget.value.trim());
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onEndEditName(event.currentTarget.value);
    }
  };

  const onFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select();
  };

  return (
    <>
      <div {...stylex.props(layerNameStyles.wrapper)}>
        {!isEditing && (
          <button
            {...stylex.props(layerNameStyles.layerNameWrapper)}
            title={t('layers.layer-name.edit-layer-title', 'Edit layer name')}
            onClick={onEditLayer}
            data-testid="layer-name-div"
          >
            <span className={overrideStyles ? '' : layerNameStyles.layerName}>{name}</span>
            <Icon name="pen" className={layerNameStyles.layerEditIcon} size="sm" />
          </button>
        )}

        {isEditing && (
          <>
            <Input
              type="text"
              defaultValue={name}
              onBlur={onEditLayerBlur}
              autoFocus
              onKeyDown={onKeyDown}
              onFocus={onFocus}
              invalid={validationError !== null}
              onChange={onInputChange}
              {...stylex.props(layerNameStyles.layerNameInput)}
              data-testid="layer-name-input"
            />
            {validationError && <FieldValidationMessage horizontal>{validationError}</FieldValidationMessage>}
          </>
        )}
      </div>
    </>
  );
};

