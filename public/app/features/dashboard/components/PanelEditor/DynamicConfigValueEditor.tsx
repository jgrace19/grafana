import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { dynamicConfigValueEditorStyles } from './DynamicConfigValueEditor.stylex';
import { useId } from 'react';
import Highlighter from 'react-highlight-words';

import {
  type DynamicConfigValue,
  type FieldConfigOptionsRegistry,
  FieldConfigProperty,
  type FieldOverrideContext,
  type GrafanaTheme2,
} from '@grafana/data';
import { t } from '@grafana/i18n';
import { Counter, Field, Stack, IconButton, Label, useStyles2 } from '@grafana/ui';

import { OptionsPaneCategory } from './OptionsPaneCategory';

interface DynamicConfigValueEditorProps {
  property: DynamicConfigValue;
  registry: FieldConfigOptionsRegistry;
  onChange: (value: DynamicConfigValue) => void;
  context: FieldOverrideContext;
  onRemove: () => void;
  isSystemOverride?: boolean;
  searchQuery: string;
}

export const DynamicConfigValueEditor = ({
  property,
  context,
  registry,
  onChange,
  onRemove,
  isSystemOverride,
  searchQuery,
}: DynamicConfigValueEditorProps) => {

  const item = registry?.getIfExists(property.id);

  const componentId = useId();

  if (!item) {
    return null;
  }

  const isCollapsible =
    Array.isArray(property.value) ||
    property.id === FieldConfigProperty.Thresholds ||
    property.id === FieldConfigProperty.Links ||
    property.id === FieldConfigProperty.Mappings;

  const labelCategory = item.category?.filter((c) => c !== item.name);
  let editor;

  /* eslint-disable react/display-name */
  const renderLabel =
    (includeDescription = true, includeCounter = false) =>
    (isExpanded = false) => (
      <Stack justifyContent="space-between">
        <Label
          category={labelCategory}
          description={includeDescription ? item.description : undefined}
          htmlFor={componentId}
        >
          <Highlighter
            textToHighlight={item.name}
            searchWords={[searchQuery]}
            highlightClassName={'search-fragment-highlight'}
          />
          {!isExpanded && includeCounter && item.getItemsCount && (
            <Counter value={item.getItemsCount(property.value)} />
          )}
        </Label>
        {!isSystemOverride && (
          <div>
            <IconButton
              name="times"
              onClick={onRemove}
              tooltip={t(
                'dashboard.dynamic-config-value-editor.render-label.tooltip-remove-property',
                'Remove property'
              )}
            />
          </div>
        )}
      </Stack>
    );
  /* eslint-enable react/display-name */

  if (isCollapsible) {
    editor = (
      <OptionsPaneCategory
        id={item.name}
        renderTitle={renderLabel(false, true)}
        className={css({
          paddingLeft: 0,
          paddingRight: 0,
        })}
        isNested
        isOpenDefault={property.value !== undefined}
      >
        <item.override
          value={property.value}
          onChange={(value) => {
            onChange(value);
          }}
          item={item}
          context={context}
        />
      </OptionsPaneCategory>
    );
  } else {
    editor = (
      <div>
        <Field label={renderLabel()()} description={item.description}>
          <item.override
            value={property.value}
            onChange={(value) => {
              onChange(value);
            }}
            item={item}
            context={context}
            id={componentId}
          />
        </Field>
      </div>
    );
  }

  return (
    <div
      {...mergeStylexClassName(stylex.props(dynamicConfigValueEditorStyles.collapsibleOverrideEditor, 
        isCollapsible && ,
        !isCollapsible && 'dynamicConfigValueEditor--nonCollapsible'
      ), undefined)}
    >
      {editor}
    </div>
  );
};

