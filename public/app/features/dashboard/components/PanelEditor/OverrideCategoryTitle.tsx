import * as stylex from '@stylexjs/stylex';

import { type FieldConfigOptionsRegistry, type ConfigOverrideRule } from '@grafana/data';
import { t } from '@grafana/i18n';
import { Button, Stack, Icon } from '@grafana/ui';
import { type FieldMatcherUIRegistryItem } from '@grafana/ui/internal';
import { colors, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

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
        <div {...stylex.props(styles.overrideDetails)}>
          <div {...stylex.props(styles.options)} title={matcherOptions}>
            {matcherOptions} <Icon name="angle-right" /> {propertyNames}
          </div>
        </div>
      )}
    </div>
  );
};

OverrideCategoryTitle.displayName = 'OverrideTitle';

const styles = stylex.create({
  overrideDetails: {
    fontSize: typography['--gf-typography-body-small-font-size'],
    color: colors['--gf-colors-text-secondary'],
    fontWeight: typography['--gf-typography-font-weight-regular'],
  },
  options: {
    overflow: 'hidden',
    paddingRight: spacing['--gf-spacing-x4'],
  },
});
