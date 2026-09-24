import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import * as React from 'react';

import { t } from '@grafana/i18n';
import { Icon, Input, FieldValidationMessage } from '@grafana/ui';
import { colors, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

import { layerNameMarker } from './markers.stylex';

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
      <div {...stylex.props(styles.wrapper)}>
        {!isEditing && (
          <button
            {...stylex.props(styles.layerNameWrapper, layerNameMarker)}
            title={t('layers.layer-name.edit-layer-title', 'Edit layer name')}
            onClick={onEditLayer}
            data-testid="layer-name-div"
          >
            <span {...stylex.props(!overrideStyles && styles.layerName)}>{name}</span>
            <Icon name="pen" className="query-name-edit-icon" xstyle={styles.layerEditIcon} size="sm" />
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
              className={stylex.props(styles.layerNameInput).className}
              data-testid="layer-name-input"
            />
            {validationError && <FieldValidationMessage horizontal>{validationError}</FieldValidationMessage>}
          </>
        )}
      </div>
    </>
  );
};

const styles = stylex.create({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: spacing['--gf-spacing-x0-5'],
  },
  layerNameWrapper: {
    display: 'flex',
    cursor: 'pointer',
    borderWidth: { default: '1px', ':hover': '1px', ':focus': '2px' },
    borderStyle: { default: 'solid', ':hover': 'dashed', ':focus': 'solid' },
    borderColor: {
      default: 'transparent',
      ':hover': colors['--gf-colors-border-strong'],
      ':focus': colors['--gf-colors-primary-border'],
    },
    borderRadius: shape['--gf-shape-radius-default'],
    alignItems: 'center',
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: spacing['--gf-spacing-x0-5'],
    margin: 0,
    backgroundColor: { default: 'transparent', ':hover': colors['--gf-colors-action-hover'] },
  },
  layerName: {
    fontWeight: typography['--gf-typography-font-weight-medium'],
    color: colors['--gf-colors-primary-text'],
    cursor: 'pointer',
    overflow: 'hidden',
    marginLeft: spacing['--gf-spacing-x0-5'],
  },
  layerEditIcon: {
    marginLeft: spacing['--gf-spacing-x2'],
    visibility: {
      default: 'hidden',
      [stylex.when.ancestor(':hover', layerNameMarker)]: 'visible',
      [stylex.when.ancestor(':focus', layerNameMarker)]: 'visible',
    },
  },
  layerNameInput: {
    maxWidth: '300px',
    marginTop: '-4px',
    marginRight: 0,
    marginBottom: '-4px',
    marginLeft: 0,
  },
});
