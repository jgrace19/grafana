
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { overrideCategoryTitleStyles } from './OverrideCategoryTitle.stylex';
import { type FieldConfigOptionsRegistry, type GrafanaTheme2, type ConfigOverrideRule } from '@grafana/data';
import { t } from '@grafana/i18n';
import { Button, Stack, Icon, useStyles2 } from '@grafana/ui';
import { type FieldMatcherUIRegistryItem } from '@grafana/ui/internal';

interface Props {
  isExpanded: boolean;
  registry: FieldConfigOptionsRegistry;
  matcherUi: FieldMatcherUIRegistryItem<ConfigOverrideRule>;
  override: ConfigOverrideRule;
  overrideName: string;
  onOverrideRemove: () => void;
}
export const OverrideCategoryTitle = ({
  isExpanded,
  registry,
  matcherUi,
  overrideName,
  override,
  onOverrideRemove,
}: Props) => {

  const properties = override.properties.map((p) => registry.getIfExists(p.id)).filter((prop) => !!prop);
  const propertyNames = properties.map((p) => p?.name).join(', ');
  const matcherOptions = matcherUi.optionsToLabel(override.matcher.options);

  return (
    <div>
      <Stack justifyContent="space-between">
        <div>{overrideName}</div>
        <Button
          variant="secondary"
          fill="text"
          icon="trash-alt"
          onClick={onOverrideRemove}
          tooltip={t('dashboard.override-category-title.tooltip-remove-override', 'Remove override')}
          aria-label={t('dashboard.override-category-title.aria-label-remove-override', 'Remove override')}
        />
      </Stack>
      {!isExpanded && (
        <div {...stylex.props(overrideCategoryTitleStyles.overrideDetails)}>
          <div {...stylex.props(overrideCategoryTitleStyles.options)} title={matcherOptions}>
            {matcherOptions} <Icon name="angle-right" /> {propertyNames}
          </div>
        </div>
      )}
    </div>
  );
};

OverrideCategoryTitle.displayName = 'OverrideTitle';

;
